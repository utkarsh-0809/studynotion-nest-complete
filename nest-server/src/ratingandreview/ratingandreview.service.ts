import { Injectable } from '@nestjs/common';
import { CreateRatingandreviewDto } from './dto/create-ratingandreview.dto';
import { UpdateRatingandreviewDto } from './dto/update-ratingandreview.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RatingAndReview, RatingAndReviewDocument } from './models/ratingsandreview';
import mongoose, { Model } from 'mongoose';
import { Course, CourseDocument } from 'src/course/models/course.schme';

@Injectable()
export class RatingandreviewService {
  constructor(
    @InjectModel(RatingAndReview.name)
    private readonly rrModel: Model<RatingAndReviewDocument>,
    @InjectModel(Course.name)
    private readonly courseModel: Model<CourseDocument>
  ) {}
  async createRating(req:any)  {
    
      const userId = req.user.userId
      const { rating, review, courseId } = req.body
  
      // Check if the user is enrolled in the course
  
      const courseDetails = await this.courseModel.findOne({
        _id: courseId,
        studentsEnroled: { $elemMatch: { $eq: userId } },
      })
  
      if (!courseDetails) {
        return {
          success: false,
          message: "Student is not enrolled in this course",
        }
      }
  
      // Check if the user has already reviewed the course
      const alreadyReviewed = await this.rrModel.findOne({
        user: userId,
        course: courseId,
      })
  
      if (alreadyReviewed) {
        return {
          success: false,
          message: "Course already reviewed by user",
        }
      }
  
      // Create a new rating and review
      const ratingReview = await this.rrModel.create({
        rating,
        review,
        course: courseId,
        user: userId,
      })
  
      // Add the rating and review to the course
      await this.courseModel.findByIdAndUpdate(courseId, {
        $push: {
          ratingAndReviews: ratingReview,
        },
      })
      await courseDetails.save()
  
      return {
        success: true,
        message: "Rating and review created successfully",
        ratingReview,
      }
}
   async getAverageRating (req:any) {
     
       const courseId = req.body.courseId
   
       // Calculate the average rating using the MongoDB aggregation pipeline
       const result = await this.rrModel.aggregate([
         {
           $match: {
             course: new mongoose.Types.ObjectId(courseId), // Convert courseId to ObjectId
           },
         },
         {
           $group: {
             _id: null,
             averageRating: { $avg: "$rating" },
           },
         },
       ])
   
       if (result.length > 0) {
         return {
           success: true,
           averageRating: result[0].averageRating,
         }
       }
   
       // If no ratings are found, return 0 as the default rating
       return { success: true, averageRating: 0 }
}
    async getAllRatingReview (){
     
        const allReviews = await this.rrModel.find({})
          .sort({ rating: "desc" })
          .populate({
            path: "user",
            select: "firstName lastName email image", // Specify the fields you want to populate from the "Profile" model
          })
          .populate({
            path: "course",
            select: "courseName", //Specify the fields you want to populate from the "Course" model
          })
          .exec()
    
        return {
          success: true,
          data: allReviews,
        }
}
    }
