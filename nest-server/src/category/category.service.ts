import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './models/category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}
  // create(createCategoryDto: CreateCategoryDto) {
  //   return 'This action adds a new category';
  // }

  // findAll() {
  //   return `This action returns all category`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} category`;
  // }

  // update(id: number, updateCategoryDto: UpdateCategoryDto) {
  //   return `This action updates a #${id} category`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} category`;
  // }
   getRandomInt(max) {
  return Math.floor(Math.random() * max)
}
  async createCategory (req:any) {
   
      const { name, description } = req.body
      if (!name) {
        return{ success: false, message: "All fields are required" }
      }
      const CategorysDetails = await this.categoryModel.create({
        name: name,
        description: description,
      })
      console.log(CategorysDetails)
      return {
        success: true,
        message: "Categorys Created Successfully",
      }
}
  async showAllCategories() {
  
    const allCategorys = await this.categoryModel.find()
    return {
      success: true,
      data: allCategorys,
    }
}
  async categoryPageDetails (req:any) {
  
    const { categoryId } = req.body

    // Get courses for the specified category
    const selectedCategory = await this.categoryModel.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec()

    console.log("SELECTED COURSE", selectedCategory)
    // Handle the case when the category is not found
    if (!selectedCategory) {
      console.log("Category not found.")
      return { success: false, message: "Category not found" }
    }
    // Handle the case when there are no courses
    if (selectedCategory.courses.length === 0) {
      console.log("No courses found for the selected category.")
      return {
        success: false,
        message: "No courses found for the selected category.",
      }
    }

    // Get courses for other categories
    const categoriesExceptSelected:any = await this.categoryModel.find({
      _id: { $ne: categoryId },
    })
    let differentCategory = await this.categoryModel.findOne(
      categoriesExceptSelected[this.getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec()
    console.log()
    // Get top-selling courses across all categories
    const allCategories = await this.categoryModel.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec()
    const allCourses = allCategories.flatMap((category) => category.courses)
    const mostSellingCourses = allCourses
      .sort((a:any, b:any) => b.sold - a.sold)
      .slice(0, 10)

   return {
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    }

  }
}