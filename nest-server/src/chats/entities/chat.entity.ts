// src/chat/schemas/chat.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop() userId: string;
  @Prop() username: string;
  @Prop() message: string;
  @Prop() courseId: string;
  @Prop() image:string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
