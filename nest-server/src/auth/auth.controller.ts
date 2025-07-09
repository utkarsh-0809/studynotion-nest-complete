import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/gaurds/rolesgaurd';
import { JwtAuthGuard } from 'src/common/gaurds/jwtauthgaurd';
import { Roles } from 'src/common/decorator/roles';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Request } from 'express';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sendotp')
  async sendotp(@Body('email') email:string){
    return this.authService.sendotp(email)
  }

  @UseGuards(AuthGuard('local'))
   @Post('/login')
   async login(@Req() req:any) {
     console.log(req.user);
     return this.authService.login(req.user);
   }
    @Post('/signup')
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('/reset-password')
  changepassword(@Req() req:any) {
    return this.authService.resetPassword(req);
  }
   @Post('/reset-password-token')
  resettoken(@Req() req:any) {
    return this.authService.resetPasswordToken(req);
  }


  @UseGuards(JwtAuthGuard)
  @Post('/changepassword')
  updatePassword(@Req() req:any,@Body() body:any){
    
    return this.authService.updatePassword(req.user,body)
  }

}
