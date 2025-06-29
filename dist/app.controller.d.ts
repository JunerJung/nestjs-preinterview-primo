import { AppService } from './app.service';
import { ApiResponseDto, ProcessPayloadDto } from './app.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getEncrypt(processPayloadDto: ProcessPayloadDto): ApiResponseDto;
}
