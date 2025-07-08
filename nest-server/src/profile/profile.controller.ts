import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from 'src/common/gaurds/jwtauthgaurd';
import { Roles } from 'src/common/decorator/roles';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard)
@Controller('/api/v1/profile/')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  create(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.create(createProfileDto);
  }

  
  @Delete('deleteProfile')
  deleteProfile(@Req() req:any){
    return this.profileService.deleteProfile(req);
  }
  @Put('updateProfile')
  updateProfile(@Req() req:any){
    return this.profileService.updateProfile(req)
  }
  @Get('getUserDetails')
  getUserDetails(@Req() req:any){
    console.log(req.user);
    return this.profileService.getAllUserDetails(req)
  }

  @Get('getEnrolledCourses')
  getEnrolledCourses(@Req() req:any){
    
    return this.profileService.getEnrolledCourses(req);
  }
  // displayPicture
  @UseInterceptors(FileInterceptor('displayPicture'))
  @Put('updateDisplayPicture')
  updateDisplayPicture(@Req() req:any,@UploadedFile()
      files: {
        displayPicture?: Express.Multer.File[];
        // resume?: Express.Multer.File[];
      }){
        req.files=files;
        console.log(req.files)
    return this.profileService.updateDisplayPitchure(req);
  }
  @Roles('Instructor')
  @Get('instructorDashboard')
  instructorDashboard(@Req() req:any){
    return this.profileService.instructorDashboard(req);
  }

}
