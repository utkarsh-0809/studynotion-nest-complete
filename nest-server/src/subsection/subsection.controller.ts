// import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
// import { SubSubsectionService } from './subsection.service';
// import { CreateSubsectionDto } from './dto/create-subsection.dto';
// import { UpdateSubsectionDto } from './dto/update-subsection.dto';

// @Controller('subsection')
// export class SubsectionController {
//   constructor(private readonly subsectionService: SubsectionService) {}

//   @Post()
//   create(@Body() createSubsectionDto: CreateSubsectionDto) {
//     return this.subsectionService.create(createSubsectionDto);
//   }

//   @Get()
//   findAll() {
//     return this.subsectionService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.subsectionService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateSubsectionDto: UpdateSubsectionDto) {
//     return this.subsectionService.update(+id, updateSubsectionDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.subsectionService.remove(+id);
//   }
// }

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFile } from '@nestjs/common';
// import { SectionService } from './section.service';
// import { CreateSectionDto } from './dto/create-section.dto';
// import { UpdateSectionDto } from './dto/update-section.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/common/gaurds/jwtauthgaurd';
import { RolesGuard } from 'src/common/gaurds/rolesgaurd';
import { Roles } from 'src/common/decorator/roles';
import { SubsectionService } from './subsection.service';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard,RolesGuard)
@Roles('Instructor')
@Controller('/api/v1/course')
export class SubsectionController {
  constructor(private readonly SubsectionService: SubsectionService) {}

  @UseInterceptors(FileInterceptor('video'))
  @Post('addSubsection')
   async create(@Req() req:any,@UploadedFile() file: Express.Multer.File) {
    req.file=file
    return await this.SubsectionService.create(req);
  }

  // @Get()
  // findAll() {
  //   return this.SubsectionService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.SubsectionService.findOne(+id);
  // }

  @Post('updateSubsection')
  async update(@Req() req:any) {
    return await this.SubsectionService.update(req);
  }

  @Delete('deleteSubsection')
  async remove(@Req() req:any) {
    return await this.SubsectionService.remove(req);
  }
}

