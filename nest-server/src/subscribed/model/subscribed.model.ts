import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SubscribedDocument = Subscribed & Document;

@Schema()
export class Subscribed {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  User: Types.ObjectId;

  @Prop({required: true})
  Date: Date; 
}

export const SubscribedSchema = SchemaFactory.createForClass(Subscribed);
