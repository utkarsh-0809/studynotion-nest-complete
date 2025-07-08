import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OTPSchema } from './dto/model/otp';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Otp.name, schema: OTPSchema }],
    
    )
  ],
  controllers: [OtpController],
  providers: [OtpService],
  exports:[OtpService]
})
export class OtpModule {}
