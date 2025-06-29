import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import {
  DeApiResponseDto,
  DePayloadDto,
  EnApiResponseDto,
  ProcessPayloadDto,
} from "./app.dto";
import * as crypto from "crypto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppService {
  private rsaPrivateKey: string;
  private rsaPublicKey: string;

  constructor(private configService: ConfigService) {
    this.rsaPrivateKey =
      this.configService.get<string>("RSA_PRIVATE_KEY") ?? "";
    this.rsaPublicKey = this.configService.get<string>("RSA_PUBLIC_KEY") ?? "";
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
        .publicEncrypt(
          {
            key: this.rsaPublicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
          },
          aesKey,
        )
        .toString("base64");

      // 5. Response data1, data2 with above api spec
      return {
        successful: true,
        data: {
          data1: encryptedAesKey,
          data2: encryptedPayload + ":" + iv.toString("base64"),
        },
      };
    } catch (error) {
      console.error("Error GetEncrypt:", error);
      return {
        successful: false,
        error_code: "Error GetEncrypt",
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
        decryptedAesKey = crypto.privateDecrypt(
          {
            key: this.rsaPrivateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "sha256",
          },
          Buffer.from(data1, "base64"),
        );
      } catch (rsaError) {
        console.error("Error decryptedAesKey:", rsaError);
        return {
          successful: false,
          error_code: "Error decryptedAesKey",
          data: null,
        };
      }

      // 2. Extract IV and encrypted payload from data2
      const parts = data2.split(":");
      const iv = Buffer.from(parts[1], "base64");
      const encryptedPayloadBase64 = parts[0];

      // 3. Decrypt payload with AES key and IV
      const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        decryptedAesKey,
        iv,
      );
      let decryptedPayload = decipher.update(
        encryptedPayloadBase64,
        "base64",
        "utf8",
      );
      decryptedPayload += decipher.final("utf8");

      return {
        successful: true,
        data: {
          payload: decryptedPayload,
        },
      };
    } catch (error) {
      console.error("Error GetDecrypt:", error);
      if (error instanceof BadRequestException) {
        return {
          successful: false,
          error_code: error.message,
          data: null,
        };
      }
      return {
        successful: false,
        error_code: "Error GetDecrypt",
        data: null,
      };
    }
  }
}
