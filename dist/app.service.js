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
    constructor(configService) {
        this.configService = configService;
        this.rsaPrivateKey =
            this.configService.get("RSA_PRIVATE_KEY") ?? "";
        if (!this.rsaPrivateKey) {
            console.error("CRITICAL ERROR: RSA_PRIVATE_KEY environment variable is not set!");
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
            const data2Value = iv.toString("base64") + ":" + encryptedPayload;
            const encryptedAesKey = crypto
                .privateEncrypt({
                key: this.rsaPrivateKey,
                padding: crypto.constants.RSA_PKCS1_PADDING,
            }, aesKey)
                .toString("base64");
            return {
                successful: true,
                data: {
                    data1: encryptedAesKey,
                    data2: data2Value,
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
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppService);
//# sourceMappingURL=app.service.js.map