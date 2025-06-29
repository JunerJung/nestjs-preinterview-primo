"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const config_1 = require("@nestjs/config");
let AppService = class AppService {
    configService;
    rsaPrivateKey;
    rsaPublicKey;
    constructor(configService) {
        this.configService = configService;
        this.rsaPrivateKey =
            this.configService.get("RSA_PRIVATE_KEY") ?? "";
        this.rsaPublicKey = this.configService.get("RSA_PUBLIC_KEY") ?? "";
    }
    GetEncrypt(payloadDto) {
        try {
            const { payload } = payloadDto;
            const aesKey = crypto.randomBytes(32);
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv("aes-256-cbc", aesKey, iv);
            let encryptedPayload = cipher.update(payload, "utf8", "base64");
            encryptedPayload += cipher.final("base64");
            const encryptedAesKey = crypto
                .publicEncrypt({
                key: this.rsaPublicKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256",
            }, aesKey)
                .toString("base64");
            return {
                successful: true,
                data: {
                    data1: encryptedAesKey,
                    data2: encryptedPayload + ":" + iv.toString("base64"),
                },
            };
        }
        catch (error) {
            console.error("Error GetEncrypt:", error);
            return {
                successful: false,
                error_code: "Error GetEncrypt",
                data: null,
            };
        }
    }
    GetDecrypt(decryptPayloadDto) {
        try {
            const { data1, data2 } = decryptPayloadDto;
            let decryptedAesKey;
            try {
                decryptedAesKey = crypto.privateDecrypt({
                    key: this.rsaPrivateKey,
                    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                    oaepHash: "sha256",
                }, Buffer.from(data1, "base64"));
            }
            catch (rsaError) {
                console.error("Error decryptedAesKey:", rsaError);
                return {
                    successful: false,
                    error_code: "Error decryptedAesKey",
                    data: null,
                };
            }
            const parts = data2.split(":");
            const iv = Buffer.from(parts[1], "base64");
            const encryptedPayloadBase64 = parts[0];
            const decipher = crypto.createDecipheriv("aes-256-cbc", decryptedAesKey, iv);
            let decryptedPayload = decipher.update(encryptedPayloadBase64, "base64", "utf8");
            decryptedPayload += decipher.final("utf8");
            return {
                successful: true,
                data: {
                    payload: decryptedPayload,
                },
            };
        }
        catch (error) {
            console.error("Error GetDecrypt:", error);
            if (error instanceof common_1.BadRequestException) {
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
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppService);
//# sourceMappingURL=app.service.js.map