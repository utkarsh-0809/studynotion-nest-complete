// src/chat/chat.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatsService } from '../chats.service';
// import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatsService) {}

  @SubscribeMessage('joinCourseRoom')
  async handleJoinRoom(
    @MessageBody() data: { courseId: string; userId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { courseId, userId } = data;
    // console.log("user joined")
    // TODO: Check if user is enrolled in course (stub for now)
    const isEnrolled = true; // Replace with DB check

    if (isEnrolled) {
      client.join(courseId);
      const history = await this.chatService.getMessages(courseId);
      console.log(history)
      client.emit('joinedRoom', { courseId, history });
    } else {
      client.emit('error', { message: 'Not enrolled in course.' });
    }
  }

  @SubscribeMessage('sendCourseMessage')
  async handleSendMessage(
    @MessageBody()
    data: { courseId: string; userId: string; username: string; message: string,image:string },
    
  ) {
    // console.log(data);
    const saved = await this.chatService.saveMessage(data);
    this.server.to(data.courseId).emit('receiveCourseMessage', saved);
  }
  @SubscribeMessage('deleteMsg')
  async deleteMessage(
    @MessageBody()
    data: {  id:string,courseId:string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(data);
    const courseId=data.courseId;

    await this.chatService.deleteMessages(data.id)
    // const history = await this.chatService.getMessages(courseId);
    this.server.to(data.courseId).emit('messageDeleted', {id:data.id});
  }
   @SubscribeMessage('editMsg')
  async editMessage(
    @MessageBody()
    data: {  id:string,courseId, message:string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(data);
    const courseId=data.courseId;

    await this.chatService.editMessage(data.id,data.message)
    // const history = await this.chatService.getMessages(courseId);
      this.server.to(data.courseId).emit('messageUpdated', { id:data.id,message: data.message });
  }
}
