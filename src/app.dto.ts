import {
  IsBoolean,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class ProcessPayloadDto {
  @IsString() // Ensures the payload is a string
  @Length(0, 2000, { message: "Payload must be between 0 and 2000 characters" }) // Defines min and max length
  payload: string;
}

class EnResponseDataDto {
  @IsString()
  data1: string;

  @IsString()
  data2: string;
}

export class EnApiResponseDto {
  @IsBoolean()
  successful: boolean;

  @IsOptional() // error_code is optional, only present on failure
  @IsString()
  error_code?: string; // Use '?' to mark it as optional

  @IsOptional() // data is optional, only present on success
  @Type(() => EnResponseDataDto) // Important for nested object validation/transformation
  @ValidateNested() // Validates the nested object if it exists
  data?: EnResponseDataDto | null; // Use '?' to mark it as optional
}

export class DePayloadDto {
  @IsString()
  data1: string;

  @IsString()
  data2: string;
}

class DecryptedResponseDataDto {
  @IsString()
  payload: string;
}

export class DeApiResponseDto {
  @IsBoolean()
  successful: boolean;

  @IsOptional()
  @IsString()
  error_code?: string;

  @IsOptional()
  @Type(() => DecryptedResponseDataDto)
  @ValidateNested()
  data?: DecryptedResponseDataDto | null;
}
