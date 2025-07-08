import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
// import {  } from 'express';
import { Roles } from 'src/common/decorator/roles';
import { JwtAuthGuard } from 'src/common/gaurds/jwtauthgaurd';
import { RolesGuard } from 'src/common/gaurds/rolesgaurd';
import { Request } from 'express';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';

@Controller('/api/v1')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('Instructor')
  @Post('/course/createCourse')
 @UseInterceptors(FileInterceptor('thumbnailImage'))
  async createCourse(@Req() req:any,@UploadedFile()
    files: {
      thumbnailImage?: Express.Multer.File[];
      // resume?: Express.Multer.File[];
    },) {
    // let req:Request;
    // req.user=reqt.user;
    req.files=files
    console.log(`curr file at ${Date.now()}`,files);
    // console.log(req.body,body)
    return await this.courseService.create(req);
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'thumbnail', maxCount: 1 },     // optional single image
      { name: 'resources', maxCount: 10 },    // optional multiple files
      { name: 'video', maxCount: 1 },         // optional video
    ]),
  )
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('Instructor')
  @Post('/course/editCourse')
  async editCourse(@Req() req:any,@UploadedFiles()
    files: {
      thumbnail?: Express.Multer.File[];
      resources?: Express.Multer.File[];
      video?: Express.Multer.File[];
    }) {
    console.log("files",files)
    return await this.courseService.update(req);
  }
  //  @UseGuards(JwtAuthGuard,RolesGuard)
  @Post('/course/getCourseDetails')
  async getCourseDetails(@Req() req:any) {
    return await this.courseService.getCourseDetails(req);
  }
  
  //  @UseGuards(JwtAuthGuard,RolesGuard)
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Post('/course/getFullCourseDetails')
  async getFullCourseDetails(@Req() req:any) {
    return await this.courseService.getFullCourseDetails(req);
  }

  // @Get()
  // findAll() {
  //   return this.courseService.findAll();
  // }
  @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('Instructor')
  @Get('/course/getInstructorCourses')
  async getInstructorCourses(@Req() req:any) {
    return await this.courseService.getInstructorCourses(req);
  }
  

  @Get('/course/getAllCourses')
  async getAllCourses(@Req() req:any) {
    return await this.courseService.getAll(req);
  }

  // @Patch(':id')
  // update(@Req() req:any, @Body() updateCourseDto: UpdateCourseDto) {
  //   return this.courseService.update(+id, updateCourseDto);
  // }
  @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles('Instructor')
  @Delete('/course/deleteCourse')
  async deleteCourse(@Req() req:any) {
    return await this.courseService.deleteCourse(req);
  }

   @UseGuards(JwtAuthGuard,RolesGuard)
  @Post('/payment/capturePayment')
  async  capture(@Req() req:any){
    return this.courseService.catpturePayment(req);
  }
   @UseGuards(JwtAuthGuard,RolesGuard)
   
  @Post('/payment/verifyPayment')
  async  verify(@Req() req:any){
    return this.courseService.verifyPayment(req);
  }
   @UseGuards(JwtAuthGuard,RolesGuard)
   
  @Post('/payment/sendPaymentSuccessEmail')
  async  success(@Req() req:any){
    return this.courseService.sendPaymentSuccessEmail(req);
  }
  
}
