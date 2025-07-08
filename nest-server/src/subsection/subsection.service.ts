import { Injectable } from '@nestjs/common';
import { CreateSubsectionDto } from './dto/create-subsection.dto';
import { UpdateSubsectionDto } from './dto/update-subsection.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SubSection, SubSectionDocument } from './models/subsection.schema';
import { Model } from 'mongoose';
import { Request } from 'express';
import { Section, SectionDocument } from 'src/section/models/section.schema';
import { uploadImageToCloudinary } from 'src/common/utils/imageuploader';

@Injectable()
export class SubsectionService {
   constructor(
    @InjectModel(SubSection.name)
    private readonly subSectionModel: Model<SubSectionDocument>,
     @InjectModel(Section.name)
    private readonly sectionModel: Model<SectionDocument>,
  ) {}
  async create(req:any) {
    const { sectionId, title, description } = req.body
        const video = req.file;
        console.log(video)
    
        // Check if all necessary fields are provided
        if (!sectionId || !title || !description || !video) {
          return  {success: false, message: "All Fields are Required" }
        }
        console.log(video)
    
        // Upload the video file to Cloudinary
        const uploadDetails = await uploadImageToCloudinary(
          video,
          process.env.FOLDER_NAME
        )
        console.log(uploadDetails)
        // Create a new sub-section with the necessary information
        const SubSectionDetails = await this.subSectionModel.create({
          title: title,
          timeDuration: `${uploadDetails.duration}`,
          description: description,
          videoUrl: uploadDetails.secure_url,
        })
    
        // Update the corresponding section with the newly created sub-section
        const updatedSection = await this.sectionModel.findByIdAndUpdate(
          { _id: sectionId },
          { $push: { subSection: SubSectionDetails._id } },
          { new: true }
        ).populate("subSection")
    
        // Return the updated section in the response
        return { success: true, data: updatedSection }
  }
  async update(req:any) {
    const { sectionId, subSectionId, title, description } = req.body
        const subSection = await this.subSectionModel.findById(subSectionId)
    
        if (!subSection) {
          return {
            success: false,
            message: "SubSection not found",
          }
        }
    
        if (title !== undefined) {
          subSection.title = title
        }
    
        if (description !== undefined) {
          subSection.description = description
        }
        if (req.files && req.files.video !== undefined) {
          const video = req.files.video
          const uploadDetails = await uploadImageToCloudinary(
            video,
            process.env.FOLDER_NAME
          )
          subSection.videoUrl = uploadDetails.secure_url
          subSection.timeDuration = `${uploadDetails.duration}`
        }
    
        await subSection.save()
    
        // find updated section and return it
        const updatedSection = await this.sectionModel.findById(sectionId).populate(
          "subSection"
        )
    
        console.log("updated section", updatedSection)
    
        return {
          success: true,
          message: "Section updated successfully",
          data: updatedSection,
        }
  }

 async remove(req:any) {
   const { subSectionId, sectionId } = req.body
       await this.sectionModel.findByIdAndUpdate(
         { _id: sectionId },
         {
           $pull: {
             subSection: subSectionId,
           },
         }
       )
       const subSection = await this.subSectionModel.findByIdAndDelete({ _id: subSectionId })
   
       if (!subSection) {
         return {success: false, message: "SubSection not found" }
       }
   
       // find updated section and return it
       const updatedSection = await this.sectionModel.findById(sectionId).populate(
         "subSection"
       )
   
       return {
         success: true,
         message: "SubSection deleted successfully",
         data: updatedSection,
       }
  }
}
