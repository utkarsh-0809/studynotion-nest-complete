import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/common/decorator/roles';
import { JwtAuthGuard } from 'src/common/gaurds/jwtauthgaurd';
import { RolesGuard } from 'src/common/gaurds/rolesgaurd';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
// import { Request } from 'express';
@Controller('/api/v1/')
export class UserController {
  constructor(private readonly userService: UserService,
    private readonly authService:AuthService
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('getUserDetails')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.userService.update({id:id}, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string&number) {
    return this.userService.remove(id);
  }

 
}
