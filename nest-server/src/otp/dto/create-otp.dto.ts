import { IsEmail, IsString } from 'class-validator';

export class CreateOtpDto {
  @IsEmail()
  email: string;

  @IsString()
  otp: string;
}
