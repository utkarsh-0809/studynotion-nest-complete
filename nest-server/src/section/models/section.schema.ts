import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SectionDocument = Section & Document;

@Schema()
export class Section {
  @Prop()
  sectionName: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'SubSection', required: true }] })
  subSection: Types.ObjectId[];
}

export const SectionSchema = SchemaFactory.createForClass(Section);
