import { Injectable } from '@nestjs/common';
import { CreateCourseprogressDto } from './dto/create-courseprogress.dto';
import { UpdateCourseprogressDto } from './dto/update-courseprogress.dto';
import { Courseprogress, CourseprogressDocument } from './models/courseprogerss';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CourseprogressController } from './courseprogress.controller';
import { SubSection, SubSectionDocument } from 'src/subsection/models/subsection.schema';

@Injectable()
export class CourseprogressService {
  constructor(
    @InjectModel(Courseprogress.name)
    private readonly courseProgressModel: Model<CourseprogressDocument>,
    @InjectModel(SubSection.name)
    private readonly SubSectionModel: Model<SubSectionDocument>
  ) {}
  // create(createCourseprogressDto: CreateCourseprogressDto) {
  //   return 'This action adds a new courseprogress';
  // }

  // findAll() {
  //   return `This action returns all courseprogress`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} courseprogress`;
  // }

  // update(id: number, updateCourseprogressDto: UpdateCourseprogressDto) {
  //   return `This action updates a #${id} courseprogress`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} courseprogress`;
  // }
  async updateCourseProgress(req:any)  {
    const { courseId, subsectionId } = req.body
    const userId = req.user.userId
  
    
      // Check if the subsection is valid
      const subsection = await this.SubSectionModel.findById(subsectionId)
      if (!subsection) {
        return { error: "Invalid subsection" }
      }
  
      // Find the course progress document for the user and course
      let courseProgress = await this.courseProgressModel.findOne({
        courseID: courseId,
        userId: userId,
      })
  
      if (!courseProgress) {
        // If course progress doesn't exist, create a new one
        return {
          success: false,
          message: "Course progress Does Not Exist",
        }
      } else {
        // If course progress exists, check if the subsection is already completed
        if (courseProgress.completedVideos.includes(subsectionId)) {
          return { error: "Subsection already completed" }
        }
  
        // Push the subsection into the completedVideos array
        courseProgress.completedVideos.push(subsectionId)
      }
  
      // Save the updated course progress
      await courseProgress.save()
  
      return { message: "Course progress updated" }
    
}
}
