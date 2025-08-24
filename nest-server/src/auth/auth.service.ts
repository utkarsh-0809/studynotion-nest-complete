import { ExecutionContext, HttpException, HttpStatus, Injectable, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import { OtpService } from 'src/otp/otp.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
// import * as otpGenerator from 'otp-generator';
import * as bcrypt from 'bcrypt';
import { ProfileService } from 'src/profile/profile.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/common/mailsender/sendmail';
import { passwordUpdated } from 'src/common/mailsender/templates/passwordUpdated';
const otpGenerator = require('otp-generator');
import * as crypto from 'crypto';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/user/model/User';
import { Model } from 'mongoose';


@Injectable()
export class AuthService {
    private readonly mailSender:MailService;
    
    constructor(
      private readonly userService: UserService,
      @InjectModel(User.name) private UserModel: Model<UserDocument>,
        private readonly otpService:OtpService,
        private readonly profileService:ProfileService,
        private jwtService: JwtService,
    ){
      this.mailSender=new MailService();
    }

    async sendotp(email:string){
        const checkUserPresent=await this.UserModel.findOne({email})
        if(checkUserPresent){
            throw new HttpException(
            {
                success: false,
                message: 'User is already registered',
            },
            HttpStatus.FOUND,
            );
        }
        
       
            const otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
            });
            await this.otpService.create({email,otp});
            return {
                success: true,
                message: `OTP Sent Successfully`,
                otp,
            }
          
    }

    async signup(info:CreateUserDto){
           const {
              firstName,
              lastName,
              email,
              password,
              accountType,
              otp,
              confirmPassword,
              contactNumber
            } = info

             if (
              !firstName ||
              !lastName ||
              !email ||
              !password ||
              !confirmPassword ||
              !accountType||
              !otp
            ) {
              return {
                success: false,
                message: "All Fields are required",
              }
            }
   
            // Check if password and confirm password match
            if (password !== confirmPassword) {
              return {
                success: false,
                message:
                  "Password and Confirm Password do not match. Please try again.",
              }
            }
        
            // Check if user already exists
            const existingUser = await this.UserModel.findOne({email})
            if (existingUser) {
              return {
                success: false,
                message: "User already exists. Please sign in to continue.",
              }
            }
        
             // Find the most recent OTP for the email
            const response = await this.otpService.findOne( email )
            console.log(response)
            if (response.length === 0) {
              // OTP not found for the email
              return {
                success: false,
                message: "The OTP is not valid",
              }
            } else if (otp !== response[0].otp ){
              // Invalid OTP
              return {
                success: false,
                message: "The OTP is not valid",
              }
            }
        
    
            const hashedPassword=await bcrypt.hash(password,10);
            console.log(hashedPassword);
            // Create the user
            let approved:any = accountType;
            approved === "Instructor" ? (approved = false) : (approved = true)
        
            // Create the Additional Profile For User
            const profileDetails:any = await this.profileService.create({
              gender: null,
              dateOfBirth: null,
              about: null,
              contactNumber: null,
            })

            const user = await this.UserModel.create({
              firstName,
              lastName,
              email,
              contactNumber,
              password: hashedPassword,
              accountType,
              approved,
              additionalDetails: profileDetails.id,
              image: "",
            })
        
            
            return{
              success: true,
              user,
              message: "User registered successfully",
            }
    
}
     async validateUser(email: string, password: string): Promise<any> {
    const user:any = await this.UserModel.findOne({email});
    if (!user) throw new UnauthorizedException('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid password');

    // remove sensitive fields
    const { password: _, ...result } = user.toObject();
    return result;
  }

  async login(user: any) {
    
    // throw new UnauthorizedException("testing this")
    const payload = { sub: user._id, email: user.email, role: user.accountType };
    return {
      token: this.jwtService.sign(payload),
      user,
    };
  
}

  
  async updatePassword(user:any,body:any){
    // console.log(user.email)
    const userDetails:any=await this.UserModel.findOne({email:user.email});
    const { oldPassword, newPassword } = body
    // console.log(userDetails);
  
    if(!userDetails||!oldPassword||!newPassword){
      return {
        message:"cannot find user"
      }
    }
  
        const isPasswordMatch = await bcrypt.compare(
          oldPassword,
          userDetails.password
        )
        if (!isPasswordMatch) {
          // If old password does not match, return a 401 (Unauthorized) error
          return { success: false, message: "The password is incorrect" };
        }
    
        // Update password
        const encryptedPassword = await bcrypt.hash(newPassword, 10)
        const updatedUserDetails:any = await this.userService.updatePass(
           user.email,
            encryptedPassword ,
        )
    
        // Send notification email
        
          const emailResponse = await this.mailSender.sendMail(
            updatedUserDetails.email,
            "Password for your account has been updated",
            passwordUpdated(
              updatedUserDetails.email,
              `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
            )
          )
          // console.log("Email sent successfully:", emailResponse.response)
         
    
        // Return success response
        return { success: true, message: "Password updated successfully" }
      
  }

  async resetPassword(req:any){
  
   const { password, confirmPassword, token } = req.body
   
       if (confirmPassword !== password) {
         return {
           success: false,
           message: "Password and Confirm Password Does not Match",
         }
       }
       console.log(token)
       const userDetails:any = await this.UserModel.findOne( {token} )
       if (!userDetails) {
         return {
           success: false,
           message: "Token is Invalid",
         }
       }
      //  if (!(userDetails.resetPasswordExpires > Date.now())) {
      //    return {
      //      success: false,
      //      message: `Token is Expired, Please Regenerate Your Token`,
      //    }
      //  }
       const encryptedPassword = await bcrypt.hash(password, 10)
       await this.UserModel.updateOne(
         { token: token },
         { password: encryptedPassword },
         { new: true }
       )
       return{
         success: true,
         message: `Password Reset Successful`,
       }
     
      
      
  }

  async resetPasswordToken( req:any){
        const {email}=req.body
        const user = await this.UserModel.findOne({email})
        if (!user) {
          return {
            success: false,
            message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
          }
        }
        const token = crypto.randomBytes(20).toString("hex")

              const updatedDetails = await this.UserModel.updateOne(
          { email: email },
          {
            token: token,
            resetPasswordExpires: Date.now() + 3600000,
          },
          { new: true }
        )
        console.log("DETAILS", updatedDetails)
    
        const protocol = req.protocol;
        const host = req.hostname;

               const port = process.env.PORT??4000;
        const url = `http://localhost:3000/update-password/${token}`
      //  const url= `${protocol}://${host}:${port}/update-password/${token}`
        // const url = `https://studynotion-edtech-project.vercel.app/update-password/${token}`
    
        await this.mailSender.sendMail(
          email,
          "Password Reset",
          `Your Link for email verification is ${url}. Please click this url to reset your password.`
        )
              return {
          success: true,
          message:
            "Email Sent Successfully, Please Check Your Email to Continue Further",
        }
 

}
}

