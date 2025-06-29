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
exports.DeApiResponseDto = exports.DePayloadDto = exports.EnApiResponseDto = exports.ProcessPayloadDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class ProcessPayloadDto {
    payload;
}
exports.ProcessPayloadDto = ProcessPayloadDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 2000, { message: "Payload must be between 0 and 2000 characters" }),
    __metadata("design:type", String)
], ProcessPayloadDto.prototype, "payload", void 0);
class EnResponseDataDto {
    data1;
    data2;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnResponseDataDto.prototype, "data1", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnResponseDataDto.prototype, "data2", void 0);
class EnApiResponseDto {
    successful;
    error_code;
    data;
}
exports.EnApiResponseDto = EnApiResponseDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], EnApiResponseDto.prototype, "successful", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], EnApiResponseDto.prototype, "error_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => EnResponseDataDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Object)
], EnApiResponseDto.prototype, "data", void 0);
class DePayloadDto {
    data1;
    data2;
}
exports.DePayloadDto = DePayloadDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DePayloadDto.prototype, "data1", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DePayloadDto.prototype, "data2", void 0);
class DecryptedResponseDataDto {
    payload;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DecryptedResponseDataDto.prototype, "payload", void 0);
class DeApiResponseDto {
    successful;
    error_code;
    data;
}
exports.DeApiResponseDto = DeApiResponseDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], DeApiResponseDto.prototype, "successful", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DeApiResponseDto.prototype, "error_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => DecryptedResponseDataDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Object)
], DeApiResponseDto.prototype, "data", void 0);
//# sourceMappingURL=app.dto.js.map