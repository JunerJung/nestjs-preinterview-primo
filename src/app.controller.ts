import {
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Body,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiResponseDto, ProcessPayloadDto } from "./app.dto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("/get-encrypt-data")
  @HttpCode(HttpStatus.OK)
  getEncrypt(@Body() processPayloadDto: ProcessPayloadDto): ApiResponseDto {
    return this.appService.GetEncrypt(processPayloadDto);
  }
}
