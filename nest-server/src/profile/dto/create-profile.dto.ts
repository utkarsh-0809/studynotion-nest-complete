import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateProfileDto {
  @IsOptional()
  @IsString()
  gender?: any;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: any;

  @IsOptional()
  @IsString()
  about?: any;

  @IsOptional()
  @IsNumber()
  contactNumber?: any;
}
