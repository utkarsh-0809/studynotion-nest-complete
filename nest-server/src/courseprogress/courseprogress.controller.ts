import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CourseprogressService } from './courseprogress.service';
import { CreateCourseprogressDto } from './dto/create-courseprogress.dto';
import { UpdateCourseprogressDto } from './dto/update-courseprogress.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/common/gaurds/jwtauthgaurd';
import { RolesGuard } from 'src/common/gaurds/rolesgaurd';
import { Roles } from 'src/common/decorator/roles';

@UseGuards(JwtAuthGuard,RolesGuard)
@Roles('Instructor')
@Controller('courseprogress')
export class CourseprogressController {
  constructor(private readonly courseprogressService: CourseprogressService) {}

  @Post('updateCourseProgress')
  async create(req:Request) {
    return await this.courseprogressService.updateCourseProgress(req);
  }

  // @Get()
  // findAll() {
  //   return this.courseprogressService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.courseprogressService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCourseprogressDto: UpdateCourseprogressDto) {
  //   return this.courseprogressService.update(+id, updateCourseprogressDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.courseprogressService.remove(+id);
  // }
}
