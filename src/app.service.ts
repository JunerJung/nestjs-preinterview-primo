import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ApiResponseDto, ProcessPayloadDto } from "./app.dto";
import * as crypto from "crypto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppService {
  private rsaPrivateKey: string;

  constructor(private configService: ConfigService) {
    // Load the RSA private key from environment variables using ConfigService.
    // In production, ensure this variable is set securely (e.g., Kubernetes secrets, CI/CD variables).
    this.rsaPrivateKey =
      this.configService.get<string>("RSA_PRIVATE_KEY") ?? "";

    if (!this.rsaPrivateKey) {
      console.error(
        "CRITICAL ERROR: RSA_PRIVATE_KEY environment variable is not set!",
      );
      throw new InternalServerErrorException(
        "Server configuration error: Private key missing.",
      );
    }

    console.log(
      "RSA Private Key successfully loaded from environment variable.",
    );
  }

  GetEncrypt(payloadDto: ProcessPayloadDto): ApiResponseDto {
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

      const data2Value = iv.toString("base64") + ":" + encryptedPayload;

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
          data1: encryptedAesKey,
          data2: data2Value,
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
}
