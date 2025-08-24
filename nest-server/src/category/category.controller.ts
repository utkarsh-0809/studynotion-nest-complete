import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Request } from 'express';
import { CacheService } from 'src/cache/cache.service';

@Controller('/api/v1/course/')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService,
    private readonly cacheService: CacheService
  ) {}

  @Post('createCategory')
  async create(@Req() req:any) {
    // console.log(req.body,body)
    
    const res= await this.categoryService.createCategory(req);
    const categories = await this.categoryService.showAllCategories();

    // Store in cache for 1 hour
     const cacheKey = 'all_categories';
    await this.cacheService.set(cacheKey, categories, 360000);
    return res;
  }

  @Get('showAllCategories')
  async showAllCategories() {
    // Check cache
    const cacheKey = 'all_categories';
    const cachedData = await this.cacheService.get(cacheKey);

    if (cachedData) {
      console.log('✅ Cache Hit');
      return cachedData;
    }

    // console.log('❌ Cache Miss');

    // Simulating DB fetch
    const categories = await this.categoryService.showAllCategories();

    // Store in cache for 1 hour
    await this.cacheService.set(cacheKey, categories, 360000);

    return categories;
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
