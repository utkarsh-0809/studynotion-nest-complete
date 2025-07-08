import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RatingAndReviewDocument = RatingAndReview & Document;

@Schema()
export class RatingAndReview {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  rating: number;

  @Prop({ required: true })
  review: string;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true, index: true })
  course: Types.ObjectId;
}

export const RatingAndReviewSchema = SchemaFactory.createForClass(RatingAndReview);
