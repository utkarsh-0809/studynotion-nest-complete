import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Request } from 'express';

@Controller('/api/v1/course/')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('createCategory')
  async create(@Req() req:any) {
    // console.log(req.body,body)
    return await this.categoryService.createCategory(req);
  }

  @Get('showAllCategories')
  async findAll() {
    return await this.categoryService.showAllCategories();
  }

  @Post('getCategoryPageDetails')
  async details(@Req() req:any) {
    console.log("hereeeeee")
    return await this.categoryService.categoryPageDetails(req);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
  //   return this.categoryService.update(+id, updateCategoryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.categoryService.remove(+id);
  // }
}
