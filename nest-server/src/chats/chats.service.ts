// // src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { Chat, ChatDocument } from './schemas/chat.schema';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from './entities/chat.entity';

@Injectable()
export class ChatsService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<ChatDocument>) {}

  async saveMessage(data: Partial<Chat>): Promise<Chat> {
    const  newMsg = new this.chatModel(data);
    return await newMsg.save();
  }

  async getMessages(courseId: string): Promise<Chat[]> {
     return await  this.chatModel.find({ courseId }).sort({ createdAt: 1 }).exec();
  }
  async deleteMessages(id: string):Promise<void> {
     await this.chatModel.findByIdAndDelete(id );
  }
  async editMessage(id: string, message: string): Promise<any> {
      await this.chatModel.findByIdAndUpdate(
      id, {message});
}
}
