import { AppService } from "./app.service";
import { DeApiResponseDto, DePayloadDto, EnApiResponseDto, ProcessPayloadDto } from "./app.dto";
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getEncrypt(processPayloadDto: ProcessPayloadDto): EnApiResponseDto;
    getDecrypt(decryptPayloadDto: DePayloadDto): DeApiResponseDto;
}
