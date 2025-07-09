import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { OtpService } from 'src/otp/otp.service';
import { ProfileService } from 'src/profile/profile.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { OtpModule } from 'src/otp/otp.module';
import { ProfileModule } from 'src/profile/profile.module';
import { JwtStrategy } from './jwtstrategy';
import { LocalStrategy } from './localstrategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/model/User';

@Module({
  imports:  [
    // forwardRef(() => UserModule)
    // ,OtpModule,ProfileModule,
    // PassportModule,
    JwtModule.register({
      secret: 'defaultsecret',
      signOptions: { expiresIn: '1d' },
    }),
     forwardRef(() => UserModule),
    forwardRef(() => ProfileModule),
    forwardRef(() => OtpModule),
    PassportModule,
    MongooseModule.forFeature([
          { name: User.name, schema: UserSchema },
   
  ]),
],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy, JwtStrategy,UserService],
  exports:[AuthService]
                     
})
export class AuthModule {}
