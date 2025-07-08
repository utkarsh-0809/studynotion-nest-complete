import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { SectionService } from './section.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/common/gaurds/jwtauthgaurd';
import { RolesGuard } from 'src/common/gaurds/rolesgaurd';
import { Roles } from 'src/common/decorator/roles';

@UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('Instructor')
@Controller('/api/v1/course')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  
  @Post('addSection')
  async create(@Req() req:any) {
    return await this.sectionService.create(req);
  }

  // @Get()
  // findAll() {
  //   return this.sectionService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.sectionService.findOne(+id);
  // }

  @Post('updateSection')
   async update(@Req() req:any) {
    return await this.sectionService.update(req);
  }

  @Post('deleteSection')
  async remove(@Req() req:any) {
    return  await this.sectionService.remove(req);
  }
}
