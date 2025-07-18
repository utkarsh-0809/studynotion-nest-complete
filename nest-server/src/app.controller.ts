import { Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  // @Post('/updatePassword/:id')
  // resettoken(@Req() req:any) {
  //   return this.appService.resetPassword(req);
  // }
}
