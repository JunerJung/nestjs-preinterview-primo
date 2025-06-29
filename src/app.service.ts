import { BadRequestException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { DeApiResponseDto, DePayloadDto, EnApiResponseDto, ProcessPayloadDto } from "./app.dto";
import * as crypto from "crypto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppService {
  private rsaPrivateKey: string;
  private rsaPublicKey: string;

  constructor(private configService: ConfigService) {
    this.rsaPrivateKey =
      this.configService.get<string>("RSA_PRIVATE_KEY") ?? "";
    this.rsaPublicKey =
      this.configService.get<string>("RSA_PUBLIC_KEY") ?? "";

    if (!this.rsaPrivateKey || !this.rsaPublicKey) {
      console.error(
        "CRITICAL ERROR: RSA_PRIVATE_KEY or RSA_PUBLIC_KEY environment variable is not set!",
      );
      throw new InternalServerErrorException(
        "Server configuration error: Private key missing.",
      );
    }

    console.log(
      "RSA Private Key successfully loaded from environment variable.",
    );
  }

  GetEncrypt(payloadDto: ProcessPayloadDto): EnApiResponseDto {
    try {
      // 1. Validate request payload
      const { payload } = payloadDto;

      // 2. Create AES key by Generate random string
      const aesKey = crypto.randomBytes(32);

      // 3. For data2, encrypt payload with AES key from step2.
      const iv = crypto.randomBytes(16);

      const cipher = crypto.createCipheriv("aes-256-cbc", aesKey, iv);
      let encryptedPayload = cipher.update(payload, "utf8", "base64");
      encryptedPayload += cipher.final("base64");

      // 4. For data1, encrypt key from step2 with private key.
      const encryptedAesKey = crypto
        .privateEncrypt(
          {
            key: this.rsaPrivateKey,
            padding: crypto.constants.RSA_PKCS1_PADDING,
          },
          aesKey,
        )
        .toString("base64");

      // 5. Response data1, data2 with above api spec
      return {
        successful: true,
        data: {
          data1: encryptedPayload,
          data2: encryptedAesKey,
        },
      };
    } catch (error) {
      console.error("Error in AppService.processData:", error);
      return {
        successful: false,
        error_code: "ENCRYPTION_PROCESSING_ERROR",
        data: null,
      };
    }
  }

  GetDecrypt(decryptPayloadDto: DePayloadDto): DeApiResponseDto {
    try {
      const { data1, data2 } = decryptPayloadDto;
      // 1. Decrypt data1 (RSA-encrypted AES key) using the private key
      let decryptedAesKey: Buffer;
      try {
        // Changed padding to RSA_PKCS1_OAEP_PADDING to match encryption
        decryptedAesKey = crypto.privateDecrypt(
          {
            key: this.rsaPrivateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, // Use OAEP padding
          },
          Buffer.from(data1, 'base64') // Data1 is base64 encoded
        );
      } catch (rsaError) {
        console.error('RSA Decryption Error (data1):', rsaError);
        return {
          successful: false,
          error_code: 'RSA_DECRYPTION_FAILED',
          data: null,
        };
      }

      // 2. Extract IV and encrypted payload from data2
      const parts = data2.split(':');
      if (parts.length !== 2) {
        throw new BadRequestException('Invalid data2 format. Expected IV:EncryptedPayload.');
      }
      const iv = Buffer.from(parts[0], 'base64');
      const encryptedPayloadBase64 = parts[1];

      if (iv.length !== 16) {
        throw new BadRequestException('Invalid IV length. Expected 16 bytes.');
      }

      // 3. Decrypt payload with AES key and IV
      const decipher = crypto.createDecipheriv('aes-256-cbc', decryptedAesKey, iv);
      let decryptedPayload = decipher.update(encryptedPayloadBase64, 'base64', 'utf8');
      decryptedPayload += decipher.final('utf8');

      return {
        successful: true,
        data: {
          payload: decryptedPayload,
        },
      };
    } catch (error) {
      console.error('Error in AppService.decryptData:', error);
      // Handle specific errors for invalid input formats or generic decryption errors
      if (error instanceof BadRequestException) {
        return {
          successful: false,
          error_code: error.message === 'Invalid IV length. Expected 16 bytes.' ? 'INVALID_IV' : 'INVALID_DATA2_FORMAT',
          data: null,
        };
      }
      return {
        successful: false,
        error_code: 'DECRYPTION_PROCESSING_ERROR',
        data: null,
      };
    }
  }
}
