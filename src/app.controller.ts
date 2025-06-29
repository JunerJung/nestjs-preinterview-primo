import {
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  Body,
} from "@nestjs/common";
import { AppService } from "./app.service";
import {
  DeApiResponseDto,
  DePayloadDto,
  EnApiResponseDto,
  ProcessPayloadDto,
} from "./app.dto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("get-encrypt-data")
  @HttpCode(HttpStatus.OK)
  getEncrypt(@Body() processPayloadDto: ProcessPayloadDto): EnApiResponseDto {
    return this.appService.GetEncrypt(processPayloadDto);
  }

  @Post("get-decrypt-data")
  @HttpCode(HttpStatus.OK)
  getDecrypt(@Body() decryptPayloadDto: DePayloadDto): DeApiResponseDto {
    return this.appService.GetDecrypt(decryptPayloadDto);
  }
}
