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

class ResponseDataDto {
  @IsString()
  data1: string;

  @IsString()
  data2: string;
}

export class ApiResponseDto {
  @IsBoolean()
  successful: boolean;

  @IsOptional() // error_code is optional, only present on failure
  @IsString()
  error_code?: string; // Use '?' to mark it as optional

  @IsOptional() // data is optional, only present on success
  @Type(() => ResponseDataDto) // Important for nested object validation/transformation
  @ValidateNested() // Validates the nested object if it exists
  data?: ResponseDataDto | null; // Use '?' to mark it as optional
}
