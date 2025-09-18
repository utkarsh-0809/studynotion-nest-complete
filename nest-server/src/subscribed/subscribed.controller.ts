import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { SubscribedService } from './subscribed.service';
import { CreateSubscribedDto } from './dto/create-subscribed.dto';
import { UpdateSubscribedDto } from './dto/update-subscribed.dto';
import { JwtAuthGuard } from 'src/common/gaurds/jwtauthgaurd';

@Controller('/api/v1')
export class SubscribedController {
  constructor(private readonly subscribedService: SubscribedService) {}

  @Post()
  create(@Body() createSubscribedDto: CreateSubscribedDto) {
    return this.subscribedService.create(createSubscribedDto);
  }

  @Get()
  findAll() {
    return this.subscribedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscribedService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubscribedDto: UpdateSubscribedDto) {
    return this.subscribedService.update(+id, updateSubscribedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subscribedService.remove(+id);
  }
   @UseGuards(JwtAuthGuard)
  @Post('/payment/captureSubscriptionPayment')
  catpturePayment(@Req() req:any){
    return this.subscribedService.catpturePayment(req)
  }
   @UseGuards(JwtAuthGuard)
  @Post('/payment/verifySubscriptionPayment')
  verifyPayment(@Req() req:any){
    return this.subscribedService.verifyPayment(req)
  }   
  @Post('/payment/sendSubscriptionSuccessEmail')
  sendPaymentSuccessEmail(@Req() req:any){
    return this.subscribedService.sendPaymentSuccessEmail(req)
  } 
  
}
