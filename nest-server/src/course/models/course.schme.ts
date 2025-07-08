import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CourseDocument = Course & Document;

@Schema({ timestamps: { createdAt: true } })
export class Course {
  @Prop()
  courseName: string;

  @Prop()
  courseDescription: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  instructor: Types.ObjectId;

  @Prop()
  whatYouWillLearn: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Section' }] })
  courseContent: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'RatingAndReview' }] })
  ratingAndReviews: Types.ObjectId[];

  @Prop()
  price: number;

  @Prop()
  thumbnail: string;

  @Prop({ type: [String], required: true })
  tag: string[];

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  category: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User', required: true }] })
  studentsEnroled: Types.ObjectId[];

  @Prop({ type: [String] })
  instructions: string[];

  @Prop({ enum: ['Draft', 'Published'] })
  status: string;

  // createdAt will automatically be handled by timestamps option
}

export const CourseSchema = SchemaFactory.createForClass(Course);
