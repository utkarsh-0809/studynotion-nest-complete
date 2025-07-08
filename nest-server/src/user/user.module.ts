import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './model/User';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { forwardRef } from '@nestjs/common'; 
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService,UserModule],
  imports:[forwardRef(() => AuthModule), MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])]
})
export class UserModule {}
