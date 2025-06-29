import { DeApiResponseDto, DePayloadDto, EnApiResponseDto, ProcessPayloadDto } from "./app.dto";
import { AppService } from "./app.service";
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getEncrypt(processPayloadDto: ProcessPayloadDto): EnApiResponseDto;
    getDecrypt(decryptPayloadDto: DePayloadDto): DeApiResponseDto;
}
