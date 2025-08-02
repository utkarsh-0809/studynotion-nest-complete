
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { Course, CourseDocument } from './course.schema';
import mongoose, { Model, Mongoose, Types } from 'mongoose';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course, CourseDocument } from './models/course.schme';
import { User, UserDocument } from 'src/user/model/User';
import { Category, CategoryDocument } from 'src/category/models/category.schema';
import { uploadImageToCloudinary } from 'src/common/utils/imageuploader';
import { convertSecondsToDuration } from 'src/common/utils/sectoduration';
import { Courseprogress, CourseprogressDocument } from 'src/courseprogress/models/courseprogerss';
import { Section, SectionDocument } from 'src/section/models/section.schema';
import { SubSection, SubSectionDocument } from 'src/subsection/models/subsection.schema';
import { InstanceLinksHost } from '@nestjs/core/injector/instance-links-host';
import { instance } from 'src/common/config/razorpay';
import * as crypto from 'crypto'
import { MailService } from 'src/common/mailsender/sendmail';
import { courseEnrollmentEmail } from 'src/common/mailsender/templates/courseenrollment';
import { paymentSuccessEmail } from 'src/common/mailsender/templates/paymentSuccess';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(Category.name) private CategoryModel: Model<CategoryDocument>,
    @InjectModel(Courseprogress.name) private CourseprogressModel: Model<CourseprogressDocument>,
    @InjectModel(Section.name) private SectionModel: Model<SectionDocument>,
    @InjectModel(SubSection.name) private SubSectionModel: Model<SubSectionDocument>,
    private readonly mailService:MailService
  ) {}
  
  async create(req:any){
     // Get user ID from request object
        const userId = req.user.userId
     console.log(req.body)
        // Get all required fields from request body
        let {
          courseName,
          courseDescription,
          whatYouWillLearn,
          price,
          tag: _tag,
          category,
          status,
          instructions: _instructions,
        } = req.body

        // console.log(req.body)
        // Get thumbnail image from request files
        const thumbnail = req.files
        // console.log("req file",thumbnail)
        // Convert the tag and instructions from stringified Array to Array
        const tag = JSON.parse(_tag)
        const instructions = JSON.parse(_instructions)
    
        console.log("tag", tag)
        console.log("instructions", instructions)
    
        // Check if any of the required fields are missing
        if (
          !courseName ||
          !courseDescription ||
          !whatYouWillLearn ||
          !price ||
          !tag.length ||
          !thumbnail ||
          !category ||
          !instructions.length
        ) {
          return {
            success: false,
            message: "All Fields are Mandatory",
          }
        }
        if (!status || status === undefined) {
          status = "Draft"
        }
        // Check if the user is an instructor
       
        const instructorDetails = await this.UserModel.findOne({
                                  _id: userId,
                                  accountType: 'Instructor',
                                });

    
        if (!instructorDetails) {
          return {
            success: false,
            message: "Instructor Details Not Found",
          }
        }
    
        // Check if the tag given is valid
        const categoryDetails = await this.CategoryModel.findById(category)
        if (!categoryDetails) {
          return {
            success: false,
            message: "Category Details Not Found",
          }
        }
        // Upload the Thumbnail to Cloudinary
        console.log("uploading...")
        const thumbnailImage = await uploadImageToCloudinary(
          thumbnail,
          process.env.FOLDER_NAME
        )
        console.log("uploaded",thumbnailImage)
        // Create a new course with the given details
        const newCourse = await this.courseModel.create({
          courseName,
          courseDescription,
          instructor: instructorDetails._id,
          whatYouWillLearn: whatYouWillLearn,
          price,
          tag,
          category: categoryDetails._id,
          thumbnail: thumbnailImage.secure_url,
          status: status,
          instructions,
        })
    
        // Add the new course to the User Schema of the Instructor
        await this.UserModel.findByIdAndUpdate(
          {
            _id: instructorDetails._id,
          },
          {
            $push: {
              courses: newCourse._id,
            },
          },
          { new: true }
        )
        // Add the new course to the Categories
        const categoryDetails2 = await this.CategoryModel.findByIdAndUpdate(
          { _id: category },
          {
            $push: {
              courses: newCourse._id,
            },
          },
          { new: true }
        )
        console.log("HEREEEEEEEE", categoryDetails2)
        // Return the new course and a success message
        return{
          success: true,
          data: newCourse,
          message: "Course Created Successfully",
        }
  }

  async update(req:any){
    console.log(req.body)
    const { courseId } = req.body
        const updates = req.body
        const course = await this.courseModel.findById(courseId)
    
        if (!course) {
          return { error: "Course not found" }
        }
    
        // If Thumbnail Image is found, update it
        if (req.files.thumbnail) {
          console.log("thumbnail update")
          const thumbnail = req.files.thumbnail
          const thumbnailImage = await uploadImageToCloudinary(
            thumbnail,
            process.env.FOLDER_NAME
          )
          course.thumbnail = thumbnailImage.secure_url
        }
    
        // Update only the fields that are present in the request body
        // for (const key in updates) {
        //   if (updates.hasOwnProperty(key)) {
        //     if (key === "tag" || key === "instructions") {
        //       course[key] = JSON.parse(updates[key])
        //     } else {
        //       course[key] = updates[key]
        //     }
        //   }
        // }
        for (const key of Object.keys(updates)) {
  if (key === 'tag' || key === 'instructions') {
    course[key] = JSON.parse(updates[key]);
  } else {
    course[key] = updates[key];
  }
}

    
        await course.save()
    
        const updatedCourse = await this.courseModel.findOne({
          _id: courseId,
        })
          .populate({
            path: "instructor",
            populate: {
              path: "additionalDetails",
            },
          })
          .populate("category")
          .populate("ratingAndReviews")
          .populate({
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          })
          .exec()
    
        return{
          success: true,
          message: "Course updated successfully",
          data: updatedCourse,
        }
  }

  async getAll(req:any){
     const allCourses = await this.courseModel.find(
          { status: "Published" },
          {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnrolled: true,
          }
        )
          .populate("instructor")
          .exec()
    
        return {
          success: true,
          data: allCourses,
        }
  }

  async getCourseDetails(req:any){
     const { courseId } = req.body
        const courseDetails = await this.courseModel.findOne({
          _id: courseId,
        })
          .populate({
            path: "instructor",
            populate: {
              path: "additionalDetails",
            },
          })
          .populate("category")
          .populate("ratingAndReviews")
          .populate({
            path: "courseContent",
            populate: {
              path: "subSection",
              select: "-videoUrl",
            },
          })
          .exec()
    
        if (!courseDetails) {
          return {
            success: false,
            message: `Could not find course with id: ${courseId}`,
          }
        }
    
       
    
        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content:any) => {
          content.subSection.forEach((subSection:any) => {
            const timeDurationInSeconds = parseInt(subSection.timeDuration)
            totalDurationInSeconds += timeDurationInSeconds
          })
        })
    
        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
    
        return {
          success: true,
          data: {
            courseDetails,
            totalDuration,
          },
        }
  }

  async getFullCourseDetails(req:any){
     const { courseId } = req.body
    //  console.log(req.user);
        const userId = req.user.userId
        const courseDetails = await this.courseModel.findOne({
          _id: courseId,
        })
          .populate({
            path: "instructor",
            populate: {
              path: "additionalDetails",
            },
          })
          .populate("category")
          .populate("ratingAndReviews")
          .populate({
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          })
          .exec()
    
        let courseProgressCount = await this.CourseprogressModel.findOne({
          courseID: courseId,
          userId: userId,
        })
    
        console.log("courseProgressCount : ", courseProgressCount)
    
        if (!courseDetails) {
          return {
            success: false,
            message: `Could not find course with id: ${courseId}`,
          }
        }
    
        // if (courseDetails.status === "Draft") {
        //   return res.status(403).json({
        //     success: false,
        //     message: `Accessing a draft course is forbidden`,
        //   });
        // }
    
        let totalDurationInSeconds = 0
        courseDetails.courseContent.forEach((content:any) => {
          content.subSection.forEach((subSection:any) => {
            const timeDurationInSeconds = parseInt(subSection.timeDuration)
            totalDurationInSeconds += timeDurationInSeconds
          })
        })
    
        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
    
        return {
          success: true,
          data: {
            courseDetails,
            totalDuration,
            completedVideos: courseProgressCount?.completedVideos
              ? courseProgressCount?.completedVideos
              : [],
          },
        }
  }

  async getInstructorCourses(req:any){
    const id = req.user.userId
        // console.log(id)
        // console.log('Type:', typeof id); // Should be 'string'

        // Find all courses belonging to the instructor
        // const instructorCourses = await this.courseModel.find({
        //   instructor: instructorId,
        // }).sort({ createdAt: -1 })
        const instructorCourses = await this.courseModel.find({instructor:new Types.ObjectId(id)});
        // Return the instructor's courses
        return {
          success: true,
          data: instructorCourses,
        }
  }

  async deleteCourse(req:any){
    const { courseId } = req.body
    
        // Find the course
        const course = await this.courseModel.findById(courseId)
        if (!course) {
          return { message: "Course not found" }
        }
        console.log(course)
    
        // Unenroll students from the course
        const studentsEnrolled = course.studentsEnroled
        for (const studentId of studentsEnrolled) {
          await this.UserModel.findByIdAndUpdate(studentId, {
            $pull: { courses: courseId },
          })
        }
    
        // Delete sections and sub-sections
        const courseSections = course.courseContent
        for (const sectionId of courseSections) {
          // Delete sub-sections of the section
          const section = await this.SectionModel.findById(sectionId)
          if (section) {
            const subSections = section.subSection
            for (const subSectionId of subSections) {
              await this.SubSectionModel.findByIdAndDelete(subSectionId)
            }
          }
    
          // Delete the section
          await this.SectionModel.findByIdAndDelete(sectionId)
        }
    
        // Delete the course
        await this.courseModel.findByIdAndDelete(courseId)
    
        return {
          success: true,
          message: "Course deleted successfully",
        }
  }


  async catpturePayment(req:any){
    const { courses } = req.body
      const userId = req.user.userId
      if (courses.length === 0) {
        return { success: false, message: "Please Provide Course ID" }
      }
    
      let total_amount = 0
    
      for (const course_id of courses) {
        let course
        try {
          // Find the course by its ID
          course = await this.courseModel.findById(course_id)
    
          // If the course is not found, return an error
          if (!course) {
            return { success: false, message: "Could not find the Course" }
          }
    
          // Check if the user is already enrolled in the course
          const uid = new mongoose.Types.ObjectId(userId)
          if (course.studentsEnroled.includes(uid)) {
            return { success: false, message: "Student is already Enrolled" }
          }
    
          // Add the price of the course to the total amount
          total_amount += course.price
        } catch (error) {
          console.log(error)
          return { success: false, message: error.message }
        }
      }
    
      const options = {
        amount: total_amount * 100,
        currency: "INR",
        receipt: Math.random().toString(),
      }
    
      try {
        // Initiate the payment using Razorpay
        const paymentResponse = await instance.orders.create(options)
        console.log(paymentResponse)
        return {
          success: true,
          data: paymentResponse,
        }
      } catch (error) {
        console.log("here is error",error)
       return { success: false, message: "Could not initiate order." }
      }
  }
  async verifyPayment(req:any) {
    const razorpay_order_id = req.body?.razorpay_order_id
    const razorpay_payment_id = req.body?.razorpay_payment_id
    const razorpay_signature = req.body?.razorpay_signature
    const courses = req.body?.courses
  
    const userId = req.user.userId
  
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !courses ||
      !userId
    ) {
      return { success: false, message: "Payment Failed" }
    }
  
    let body = razorpay_order_id + "|" + razorpay_payment_id
  
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(body.toString())
      .digest("hex")
  
    if (expectedSignature === razorpay_signature) {
      await this.enrollStudents(courses, userId)
      return { success: true, message: "Payment Verified" }
    }
  
    return { success: false, message: "Payment Failed" }
  }
  
  async sendPaymentSuccessEmail (req:any){
    const { orderId, paymentId, amount } = req.body
  
    const userId = req.user.userId
  
    if (!orderId || !paymentId || !amount || !userId) {
      return { success: false, message: "Please provide all the details" }
    }
  
  
      const enrolledStudent:any = await this.UserModel.findById(userId)
  
      await this.mailService.sendMail(
        enrolledStudent.email,
        `Payment Received`,
        paymentSuccessEmail(
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
          amount / 100,
          orderId,
          paymentId
        )
      )
}
   async enrollStudents (courses,userId) {
     if (!courses || !userId) {
       return { success: false, message: "Please Provide Course ID and User ID" };
     }
   
     for (const courseId of courses) {
       try {
         // Find the course and enroll the student in it
         const enrolledCourse = await this.courseModel.findOneAndUpdate(
           { _id: courseId },
           { $push: { studentsEnroled: userId } },
           { new: true }
         )
   
         if (!enrolledCourse) {
           return { success: false, error: "Course not found" }
         }
         console.log("Updated course: ", enrolledCourse)
   
         const courseProgress = await this.CourseprogressModel.create({
           courseID: courseId,
           userId: userId,
           completedVideos: [],
         })
         // Find the student and add the course to their list of enrolled courses
         const enrolledStudent:any = await this.UserModel.findByIdAndUpdate(
           userId,
           {
             $push: {
               courses: courseId,
               courseProgress: courseProgress._id,
             },
           },
           { new: true }
         )
   
         console.log("Enrolled student: ", enrolledStudent)
         // Send an email notification to the enrolled student
         const emailResponse = await this.mailService.sendMail(
           enrolledStudent.email,
           `Successfully Enrolled into ${enrolledCourse.courseName}`,
           courseEnrollmentEmail(
             enrolledCourse.courseName,
             `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
           )
         )
   
         console.log("Email sent successfully: ", emailResponse.response)
       } catch (error) {
         console.log(error)
         return { success: false, error: error.message }
       }
     }
   }

   async getCoursesValue(id:any){
    const objectId = new Types.ObjectId(id);
    console.log(objectId);
    const courses=await this.courseModel.find({instructor:objectId});
    console.log("courses",courses);
    let total=0;
    courses.forEach((val,ind)=>{
      total+=val.price*val.studentsEnroled.length;
    })
    return total;
   }
}
