
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { account } from '../dto/accountType.enum';

export type UserDocument = HydratedDocument<User>;

@Schema( {timestamps: true })
export class User {
    // If you omit @Prop(), that property will not be included in the generated Mongoose schema.
    // but it will be visible in ts
  @Prop({
    required:true,
    trim:true
  })
  firstName: string;

   @Prop({
    trim:true
  })
  lastName?: string;


  @Prop({
    trim:true
  })
  email: string;

  @Prop()
  password:string

  @Prop()
  accountType:account

  @Prop()
  active?:boolean=true

  @Prop()
  approved?:boolean=true

  
@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' })
  additionalDetails?:any

  @Prop({ type: [Types.ObjectId], ref: 'Course' })
  courses?:[any]

  @Prop()
  token?:string

  @Prop()
  resetPasswordExpires?: Date;

  @Prop()
  image?: string;

  @Prop({ type: [Types.ObjectId], ref: 'courseProgress' })
  courseProgress?: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);


// const userSchema = new mongoose.Schema(
//   {
//     // Define the name field with type String, required, and trimmed




//     resetPasswordExpires: {
//       type: Date,
//     },
//     image: {
//       type: String,
//     },
//     courseProgress: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "courseProgress",
//       },
//     ],

//     // Add timestamps for when the document is created and last modified
//   },
//   { timestamps: true }
// )