export declare class ProcessPayloadDto {
    payload: string;
}
declare class ResponseDataDto {
    data1: string;
    data2: string;
}
export declare class ApiResponseDto {
    successful: boolean;
    error_code?: string;
    data?: ResponseDataDto | null;
}
export {};
