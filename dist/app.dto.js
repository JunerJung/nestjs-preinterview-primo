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
exports.ApiResponseDto = exports.ProcessPayloadDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class ProcessPayloadDto {
    payload;
}
exports.ProcessPayloadDto = ProcessPayloadDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Length)(0, 2000, { message: 'Payload must be between 0 and 2000 characters' }),
    __metadata("design:type", String)
], ProcessPayloadDto.prototype, "payload", void 0);
class ResponseDataDto {
    data1;
    data2;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResponseDataDto.prototype, "data1", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResponseDataDto.prototype, "data2", void 0);
class ApiResponseDto {
    successful;
    error_code;
    data;
}
exports.ApiResponseDto = ApiResponseDto;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ApiResponseDto.prototype, "successful", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApiResponseDto.prototype, "error_code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => ResponseDataDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", Object)
], ApiResponseDto.prototype, "data", void 0);
//# sourceMappingURL=app.dto.js.map