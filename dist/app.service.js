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
        this.rsaPublicKey =
            this.configService.get("RSA_PUBLIC_KEY") ?? "";
        if (!this.rsaPrivateKey || !this.rsaPublicKey) {
            console.error("CRITICAL ERROR: RSA_PRIVATE_KEY or RSA_PUBLIC_KEY environment variable is not set!");
            throw new common_1.InternalServerErrorException("Server configuration error: Private key missing.");
        }
        console.log("RSA Private Key successfully loaded from environment variable.");
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
                .privateEncrypt({
                key: this.rsaPrivateKey,
                padding: crypto.constants.RSA_PKCS1_PADDING,
            }, aesKey)
                .toString("base64");
            return {
                successful: true,
                data: {
                    data1: encryptedPayload,
                    data2: encryptedAesKey,
                },
            };
        }
        catch (error) {
            console.error("Error in AppService.processData:", error);
            return {
                successful: false,
                error_code: "ENCRYPTION_PROCESSING_ERROR",
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
                }, Buffer.from(data1, 'base64'));
            }
            catch (rsaError) {
                console.error('RSA Decryption Error (data1):', rsaError);
                return {
                    successful: false,
                    error_code: 'RSA_DECRYPTION_FAILED',
                    data: null,
                };
            }
            const parts = data2.split(':');
            if (parts.length !== 2) {
                throw new common_1.BadRequestException('Invalid data2 format. Expected IV:EncryptedPayload.');
            }
            const iv = Buffer.from(parts[0], 'base64');
            const encryptedPayloadBase64 = parts[1];
            if (iv.length !== 16) {
                throw new common_1.BadRequestException('Invalid IV length. Expected 16 bytes.');
            }
            const decipher = crypto.createDecipheriv('aes-256-cbc', decryptedAesKey, iv);
            let decryptedPayload = decipher.update(encryptedPayloadBase64, 'base64', 'utf8');
            decryptedPayload += decipher.final('utf8');
            return {
                successful: true,
                data: {
                    payload: decryptedPayload,
                },
            };
        }
        catch (error) {
            console.error('Error in AppService.decryptData:', error);
            if (error instanceof common_1.BadRequestException) {
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
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppService);
//# sourceMappingURL=app.service.js.map