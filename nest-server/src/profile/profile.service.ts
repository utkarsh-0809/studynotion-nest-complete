import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
// import { Profile, ProfileDocument } from './profile.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from './models/Profile';
import mongoose, { Model } from 'mongoose';
// import { UserModel } from 'src/user/user.service';
import { Doc } from 'prettier';
import { User, UserDocument } from 'src/user/model/User';
import { Course, CourseDocument } from 'src/course/models/course.schme';
import { Courseprogress, CourseprogressDocument } from 'src/courseprogress/models/courseprogerss';
import { uploadImageToCloudinary } from 'src/common/utils/imageuploader';
import { convertSecondsToDuration } from 'src/common/utils/sectoduration';
// import { Injectable } from '@nestjs/common';
// import { CreateProfileDto } from './dto/create-profile.dto';


@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private profileModel: Model<ProfileDocument>,
    @InjectModel(Course.name) private CourseModel: Model<CourseDocument>,
    @InjectModel(Courseprogress.name) private CourseprogressModel: Model<CourseprogressDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    // private readonly UserModel:UserService
  ) {}
 async create(createProfileDto: CreateProfileDto) {
     return await this.profileModel.create(createProfileDto);
  }

 

  findOne(profile:any):any {
   
    return this.profileModel.findOne(profile);
  }

  
  async updateProfile(req:any){
    let {
          firstName = "",
          lastName = "",
          dateOfBirth = "",
          about = "",
          contactNumber = "",
          gender = "",
        } = req.body
        const id = req.user.userId
    
        // Find the profile by id
        const userDetails:any = await this.UserModel.findById(id)
        console.log(userDetails);
        const profile = await this.findOne(userDetails.additionalDetails)
        console.log(profile);
        if(firstName==="") firstName=userDetails.firstName;
        if(lastName==="") lastName=userDetails.lastName;
        const user:any = await this.UserModel.findByIdAndUpdate(id, {
          firstName,
          lastName,
        })
        await user.save()
    
        // Update the profile fields
        profile.dateOfBirth = dateOfBirth
        profile.about = about
        profile.contactNumber = contactNumber
        profile.gender = gender
    
        // Save the updated profile
        await profile.save()
    
        // Find the updated user details
        const updatedUserDetails:any = await this.UserModel.findById(id)
          .populate("additionalDetails")
          .exec()
    
        return {
          success: true,
          message: "Profile updated successfully",
          updatedUserDetails,
        }
  }
  async deleteProfile(req:any){
    const id = req.user.userId
        console.log(id)
        const user:any = await this.UserModel.findOne({id});
        if (!user) {
          return {
            success: false,
            message: "User not found",
          }
        }
        // Delete Assosiated Profile with the User
        await this.profileModel.findByIdAndDelete({
          _id: new mongoose.Types.ObjectId(user.additionalDetails),
        })
        for (const courseId of user.courses) {
          await this.CourseModel.findByIdAndUpdate(
            courseId,
            { $pull: { studentsEnroled: id } },
            { new: true }
          )
        }
        // Now Delete User
        await this.UserModel.deleteOne({ _id: id })
        await this.CourseprogressModel.deleteMany({ userId: id })
        return{
          success: true,
          message: "User deleted successfully",
        }
        
  }

  async getAllUserDetails(req:any){
     const id = req.user.userId
    //  console.log(id);
        const userDetails:any = await this.UserModel.findById(id)
          .populate("additionalDetails")
          .exec()
        // console.log(userDetails)
        return{
          success: true,
          message: "User Data fetched successfully",
          data: userDetails,
        }
  }

  async updateDisplayPitchure(req:any){
    const displayPicture = req.files
        const userId = req.user.userId
        const image = await uploadImageToCloudinary(
          displayPicture,
          process.env.FOLDER_NAME,
          1000,
          1000
        )
        console.log(image)
        const updatedProfile = await this.UserModel.findOneAndUpdate(
          { _id: userId },
          { image: image.secure_url },
          { new: true }
        )
        return {
          success: true,
          message: `Image Updated successfully`,
          data: updatedProfile,
        }
  }

  async getEnrolledCourses(req:any){
     const userId = req.user.userId
        let userDetails:any = await this.UserModel.findOne({
          _id: userId,
        })
          .populate({
            path: "courses",
            populate: {
              path: "courseContent",
              populate: {
                path: "subSection",
              },
            },
          })
          .exec()
        userDetails = userDetails.toObject()
        var SubsectionLength = 0
        for (var i = 0; i < userDetails.courses.length; i++) {
          let totalDurationInSeconds = 0
          SubsectionLength = 0
          for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
            totalDurationInSeconds += userDetails.courses[i].courseContent[
              j
            ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
            userDetails.courses[i].totalDuration = convertSecondsToDuration(
              totalDurationInSeconds
            )
            SubsectionLength +=
              userDetails.courses[i].courseContent[j].subSection.length
          }
          let courseProgressCount:any = await this.CourseprogressModel.findOne({
            courseID: userDetails.courses[i]._id,
            userId: userId,
          })
          courseProgressCount = courseProgressCount?.completedVideos.length
          if (SubsectionLength === 0) {
            userDetails.courses[i].progressPercentage = 100
          } else {
            // To make it up to 2 decimal point
            const multiplier = Math.pow(10, 2)
            userDetails.courses[i].progressPercentage =
              Math.round(
                (courseProgressCount / SubsectionLength) * 100 * multiplier
              ) / multiplier
          }
        }
    
        if (!userDetails) {
          return {
            success: false,
            message: `Could not find user with id: ${userDetails}`,
          }
        }
        return {
          success: true,
          data: userDetails.courses,
        }
  }

  async instructorDashboard(req:any){
  
    const courseDetails = await this.CourseModel.find({ instructor: req.user.userId })
    
        const courseData = courseDetails.map((course) => {
          const totalStudentsEnrolled = course.studentsEnroled.length
          const totalAmountGenerated = totalStudentsEnrolled * course.price
    
          // Create a new object with the additional fields
          const courseDataWithStats = {
            _id: course._id,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            // Include other course properties as needed
            totalStudentsEnrolled,
            totalAmountGenerated,
          }
    
          return courseDataWithStats
        })
    
        return{ courses: courseData };
  }
}
