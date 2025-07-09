import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './user/model/User';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailService } from './common/mailsender/sendmail';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AppService {
  // private readonly mailSender:MailService;
  // constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>){
  //   this.mailSender=new MailService();
  // }
  getHello(): string {
    return 'Hello World!';
  }
  // async resetPassword(req:any){
  //    const { password, confirmPassword, token } = req
     
  //        if (confirmPassword !== password) {
  //          return {
  //            success: false,
  //            message: "Password and Confirm Password Does not Match",
  //          }
  //        }
  //        const userDetails:any = await this.UserModel.findOne( {token} )
  //        if (!userDetails) {
  //          return {
  //            success: false,
  //            message: "Token is Invalid",
  //          }
  //        }
  //        if (!(userDetails.resetPasswordExpires > Date.now())) {
  //          return {
  //            success: false,
  //            message: `Token is Expired, Please Regenerate Your Token`,
  //          }
  //        }
  //        const encryptedPassword = await bcrypt.hash(password, 10)
  //        await this.UserModel.updateOne(
  //          { token: token },
  //          { password: encryptedPassword },
  //          { new: true }
  //        )
  //        return{
  //          success: true,
  //          message: `Password Reset Successful`,
  //        }
       
        
        
  //   }
}
