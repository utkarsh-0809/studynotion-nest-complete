// import { Module } from '@nestjs/common';
// import { CategoryService } from './category.service';
// import { CategoryController } from './category.controller';

// @Module({
//   controllers: [CategoryController],
//   providers: [CategoryService],
// })
// export class CategoryModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { Category, CategorySchema } from './category.schema';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category, CategorySchema } from './models/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
 