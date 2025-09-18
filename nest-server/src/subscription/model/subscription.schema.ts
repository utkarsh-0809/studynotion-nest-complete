import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

@Schema()
export class Subscription {
  @Prop({ required: true })
  Plan: string;

  @Prop({required: true})
  Cost: number;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
