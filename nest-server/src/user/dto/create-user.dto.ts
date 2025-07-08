// create-user.dto.ts
import { IsString, IsEmail,IsNotEmpty, IsEnum, IsOptional, IsBoolean } from 'class-validator';
// import { Types } from 'mongoose';
// import { isStringObject } from 'util/types';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsEnum(['Admin', 'Student', 'Instructor'])
  readonly accountType: string;

  @IsBoolean()
  @IsOptional()
  readonly active?: boolean;

  @IsBoolean()
  @IsOptional()
  readonly approved?: boolean;

  @IsString()
  @IsNotEmpty()
  readonly additionalDetails: string; // send ObjectId as string

  @IsOptional()
  readonly courses?: string[]; // array of course ObjectIds

  @IsString()
  @IsOptional()
  readonly token?: string;

  @IsOptional()
  readonly resetPasswordExpires?: Date;

  @IsString()
  @IsOptional()
  readonly image?: string;

  @IsOptional()
  readonly courseProgress?: string[]; // array of courseProgress ObjectIds

  @IsOptional()
  readonly otp?:number
  @IsOptional()
  readonly confirmPassword?:string

  @IsOptional()
  readonly contactNumber?:number
}

// const userSchema = new mongoose.Schema(
//   {
//     // Define the name field with type String, required, and trimmed
//     firstName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     lastName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     // Define the email field with type String, required, and trimmed
//     email: {
//       type: String,
//       required: true,
//       trim: true,
    
//     },

//     // Define the password field with type String and required
//     password: {
//       type: String,
//       required: true,
//     },
//     // Define the role field with type String and enum values of "Admin", "Student", or "Visitor"
//     accountType: {
//       type: String,
//       enum: ["Admin", "Student", "Instructor"],
//       required: true,
//     },
//     active: {
//       type: Boolean,
//       default: true,
//     },
//     approved: {
//       type: Boolean,
//       default: true,
//     },
//     additionalDetails: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "Profile",
//     },
//     courses: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Course",
//       },
//     ],
//     token: {
//       type: String,
//     },
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