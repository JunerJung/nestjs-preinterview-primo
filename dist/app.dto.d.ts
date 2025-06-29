export declare class ProcessPayloadDto {
    payload: string;
}
declare class EnResponseDataDto {
    data1: string;
    data2: string;
}
export declare class EnApiResponseDto {
    successful: boolean;
    error_code?: string;
    data?: EnResponseDataDto | null;
}
export declare class DePayloadDto {
    data1: string;
    data2: string;
}
declare class DecryptedResponseDataDto {
    payload: string;
}
export declare class DeApiResponseDto {
    successful: boolean;
    error_code?: string;
    data?: DecryptedResponseDataDto | null;
}
export {};
