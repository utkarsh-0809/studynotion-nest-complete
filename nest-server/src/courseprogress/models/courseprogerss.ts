import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CourseprogressDocument = Courseprogress & Document;

@Schema()
export class Courseprogress {
  @Prop({ type: Types.ObjectId, ref: 'Course' })
  courseID: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'SubSection' }] })
  completedVideos: Types.ObjectId[];
}

export const CourseprogressSchema = SchemaFactory.createForClass(Courseprogress);
