import { Injectable } from '@nestjs/common';
import { CreateSubscribedDto } from './dto/create-subscribed.dto';
import { UpdateSubscribedDto } from './dto/update-subscribed.dto';
import mongoose, { Model } from 'mongoose';
import { instance } from 'src/common/config/razorpay';
import * as crypto from 'crypto'
import { User, UserDocument } from 'src/user/model/User';
import { InjectModel } from '@nestjs/mongoose';
import { Subscribed, SubscribedDocument } from './model/subscribed.model';
import { MailService } from 'src/common/mailsender/sendmail';
import { paymentSuccessEmail } from 'src/common/mailsender/templates/paymentSuccess';
@Injectable()
export class SubscribedService {
  constructor(
    @InjectModel(Subscribed.name)
    private subscribedModel:Model<SubscribedDocument>,
    @InjectModel(User.name) private userModel:Model<UserDocument>,
    private readonly mailService:MailService
  ){}
  create(createSubscribedDto: CreateSubscribedDto) {
    return 'This action adds a new subscribed';
  }

  findAll() {
    return `This action returns all subscribed`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscribed`;
  }

  update(id: number, updateSubscribedDto: UpdateSubscribedDto) {
    return `This action updates a #${id} subscribed`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscribed`;
  }

  async catpturePayment(req:any){
      const { details } = req.body
        const userId = req.user.userId
        // if (courses.length === 0) {
        //   return { success: false, message: "Please Provide Course ID" }
        // }
        
        let total_amount = 1000;
        if(details.title=="Monthly Plan")
          total_amount=1000;
        else if(details.title=="Yearly Plan")
          total_amount=8000;
        else total_amount=3000;
        console.log("total_amount",total_amount);
      
        // for (const course_id of courses) {
        //   let course
        //   try {
        //     // Find the course by its ID
        //     // course = await this.courseModel.findById(course_id)
      
        //     // If the course is not found, return an error
        //     // if (!course) {
        //     //   return { success: false, message: "Could not find the Course" }
        //     // }
      
        //     // Check if the user is already enrolled in the course
        //     const uid = new mongoose.Types.ObjectId(userId)
        //     if (course.studentsEnroled.includes(uid)) {
        //       return { success: false, message: "Student is already Enrolled" }
        //     }
      
        //     // Add the price of the course to the total amount
        //     total_amount += course.price
        //   } catch (error) {
        //     console.log(error)
        //     return { success: false, message: error.message }
        //   }
        // }
      
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
      const details=req.body?.details;
      // const courses = req.body?.courses
    
      const userId = req.user.userId 
    console.log("verified request",req.body)
      if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature ||
        !details ||
        !userId
      ) {
        return { success: false, message: "Payment Failed" }
      }
    
      let body = razorpay_order_id + "|" + razorpay_payment_id
    
      const expectedSignature =crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET!)
        .update(body.toString())
        .digest("hex")
     
      if (expectedSignature === razorpay_signature) {
        // await this.enrollStudents(courses, userId)
        const curr:any=await this.userModel.findById(userId);
        let currDate:any=curr.subscriptionExpires;
        if(!currDate) currDate=new Date();
        // let today=new Date();
        if(details.title=="Monthly Plan")
          currDate.setMonth(currDate.getMonth()+1);
        else if(details.title=="Yearly Plan")
          currDate.setFullYear(currDate.getFullYear()+1);
        else currDate.setMonth(currDate.getMonth()+4);

        await this.userModel.findByIdAndUpdate(userId,{subscriptionExpires:currDate},{new:true});
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
    
    
        const enrolledStudent:any = await this.userModel.findById(userId)
    
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
     
         //    for (const courseId of courses) {
    //      try {
    //        // Find the course and enroll the student in it
    //        const enrolledCourse = await this.courseModel.findOneAndUpdate(
    //          { _id: courseId },
    //          { $push: { studentsEnroled: userId } },
    //          { new: true }
    //        )
     
    //        if (!enrolledCourse) {
    //          return { success: false, error: "Course not found" }
    //        }
    //        console.log("Updated course: ", enrolledCourse)
     
    //        const courseProgress = await this.CourseprogressModel.create({
    //          courseID: courseId,
    //          userId: userId,
    //          completedVideos: [],
    //        })
    //        // Find the student and add the course to their list of enrolled courses
    //        const enrolledStudent:any = await this.UserModel.findByIdAndUpdate(
    //          userId,
    //          {
    //            $push: {
    //              courses: courseId,
    //              courseProgress: courseProgress._id,
    //            },
    //          },
    //          { new: true }
    //        )
     
    //        console.log("Enrolled student: ", enrolledStudent)
    //        // Send an email notification to the enrolled student
    //        const emailResponse = await this.mailService.sendMail(
    //          enrolledStudent.email,
    //          `Successfully Enrolled into ${enrolledCourse.courseName}`,
    //          courseEnrollmentEmail(
    //            enrolledCourse.courseName,
    //            `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
    //          )
    //        )
     
    //        console.log("Email sent successfully: ", emailResponse.response)
    //      } catch (error) {
    //        console.log(error)
    //        return { success: false, error: error.message }
    //      }
    //    }
    //  }
  
    //  async getCoursesValue(id:any){
    //   const objectId = new Types.ObjectId(id);
    //   console.log(objectId);
    //   const courses=await this.courseModel.find({instructor:objectId});
    //   console.log("courses",courses);
    //   let total=0;
    //   courses.forEach((val,ind)=>{
    //     total+=val.price*val.studentsEnroled.length;
    //   })
    //   return total;
     }
}
