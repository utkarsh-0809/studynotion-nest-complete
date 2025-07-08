import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubSectionDocument = SubSection & Document;

@Schema()
export class SubSection {
  @Prop()
  title: string;

  @Prop()
  timeDuration: string;

  @Prop()
  description: string;

  @Prop()
  videoUrl: string;
}

export const SubSectionSchema = SchemaFactory.createForClass(SubSection);
