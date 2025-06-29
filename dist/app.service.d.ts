import { ApiResponseDto, ProcessPayloadDto } from "./app.dto";
import { ConfigService } from "@nestjs/config";
export declare class AppService {
    private configService;
    private rsaPrivateKey;
    constructor(configService: ConfigService);
    GetEncrypt(payloadDto: ProcessPayloadDto): ApiResponseDto;
}
