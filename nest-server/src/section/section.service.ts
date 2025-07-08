import { Injectable } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Section, SectionDocument } from './models/section.schema';
import { Course, CourseDocument } from 'src/course/models/course.schme';
import { SubSection, SubSectionDocument } from 'src/subsection/models/subsection.schema';

@Injectable()
export class SectionService {
   constructor(
    @InjectModel(Section.name)
    private readonly sectionModel: Model<SectionDocument>,
    @InjectModel(Course.name)
    private readonly courseModel: Model<CourseDocument>,
    @InjectModel(SubSection.name)
    private readonly SubSectionModel: Model<SubSectionDocument>
  ) {}
  async create(req:any) {
     const { sectionName, courseId } = req.body
    
        // Validate the input
        if (!sectionName || !courseId) {
          return {
            success: false,
            message: "Missing required properties",
          }
        }
    
        // Create a new section with the given name
        const newSection = await this.sectionModel.create({ sectionName })
    
        // Add the new section to the course's content array
        const updatedCourse = await this.courseModel.findByIdAndUpdate(
          courseId,
          {
            $push: {
              courseContent: newSection._id,
            },
          },
          { new: true }
        )
          .populate({
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          })
          .exec()
    
        // Return the updated course object in the response
       return {
          success: true,
          message: "Section created successfully",
          updatedCourse,
        }
  }

  // findAll() {
  //   return `This action returns all section`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} section`;
  // }

  async update(req:any) {
    const { sectionName, sectionId, courseId } = req.body
        const section = await this.sectionModel.findByIdAndUpdate(
          sectionId,
          { sectionName },
          { new: true }
        )
        const course = await this.courseModel.findById(courseId)
          .populate({
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          })
          .exec()
        // console.log(course)
       return{
          success: true,
          message: section,
          data: course,
        }
  }

  async remove(req:any) {
    const { sectionId, courseId } = req.body
    await this.courseModel.findByIdAndUpdate(courseId, {
          $pull: {
            courseContent: sectionId,
          },
        })
        const section = await this.sectionModel.findById(sectionId)
        console.log(sectionId, courseId)
        if (!section) {
          return {
            success: false,
            message: "Section not found",
          }
        }
        // Delete the associated subsections
        await this.SubSectionModel.deleteMany({ _id: { $in: section.subSection } })
    
        await this.sectionModel.findByIdAndDelete(sectionId)
    
        // find the updated course and return it
        const course = await this.courseModel.findById(courseId)
          .populate({
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          })
          .exec()
    
       return{
          success: true,
          message: "Section deleted",
          data: course,
        }
  }
}
