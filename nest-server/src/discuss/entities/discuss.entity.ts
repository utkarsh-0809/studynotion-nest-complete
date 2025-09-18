// export class Discuss {}
// discussion.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Comment {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  body: string;

  @Prop({ default: 0 })
  upvotes: number;
}

const CommentSchema = SchemaFactory.createForClass(Comment);

@Schema({ timestamps: true })
export class Discussion extends Document {
  @Prop({ required: true })
  category: string; // e.g. "DSA", "Web Dev"

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  body: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  upvotes: Types.ObjectId[];

  @Prop({ type: [CommentSchema], default: [] })
  comments: Comment[];
}

export const DiscussionSchema = SchemaFactory.createForClass(Discussion);
