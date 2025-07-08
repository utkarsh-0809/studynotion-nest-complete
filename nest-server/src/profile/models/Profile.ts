import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProfileDocument = Profile & Document;

@Schema()
export class Profile {
  @Prop()
  gender?: string;

  @Prop()
  dateOfBirth?: string;

  @Prop({ trim: true })
  about?: string;

  @Prop()
  contactNumber?: number;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
