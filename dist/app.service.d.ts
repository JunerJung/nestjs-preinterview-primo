import { DeApiResponseDto, DePayloadDto, EnApiResponseDto, ProcessPayloadDto } from "./app.dto";
import { ConfigService } from "@nestjs/config";
export declare class AppService {
    private configService;
    private rsaPrivateKey;
    private rsaPublicKey;
    constructor(configService: ConfigService);
    GetEncrypt(payloadDto: ProcessPayloadDto): EnApiResponseDto;
    GetDecrypt(decryptPayloadDto: DePayloadDto): DeApiResponseDto;
}
