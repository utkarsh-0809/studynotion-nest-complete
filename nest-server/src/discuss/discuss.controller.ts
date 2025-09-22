import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Req } from '@nestjs/common';
// import { DiscussionsService, DiscussService } from './discuss.service';
import { CreateDiscussDto } from './dto/create-discuss.dto';
import { UpdateDiscussDto } from './dto/update-discuss.dto';
import { DiscussionsService } from './discuss.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/common/gaurds/jwtauthgaurd';
import { request, Request } from 'express';
// @Controller('discuss')
// export class DiscussController {
//   constructor(private readonly discussService: DiscussService) {}

//   @Post()
//   create(@Body() createDiscussDto: CreateDiscussDto) {
//     return this.discussService.create(createDiscussDto);
//   }

//   @Get()
//   findAll() {
//     return this.discussService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string) {
//     return this.discussService.findOne(+id);
//   }

//   @Patch(':id')
//   update(@Param('id') id: string, @Body() updateDiscussDto: UpdateDiscussDto) {
//     return this.discussService.update(+id, updateDiscussDto);
//   }

//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.discussService.remove(+id);
//   }
// }
// discussions.controller.ts
// import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
// import { DiscussionsService } from './discussions.service';

@Controller('/api/v1/main/discussions')
export class DiscussionsController {
  constructor(private readonly discussionsService: DiscussionsService) {}

  @Post()
  create(@Body() createDto: any) {
    console.log("createDto",createDto)
    return this.discussionsService.create(createDto);
  }

  @Get()
  findAll() {
    // console.log("Fetching all discussions");
    return this.discussionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discussionsService.findOne(id);
  }

  @Put(':id/upvote/:userId')
  upvote(@Param('id') id: string, @Param('userId') userId: string) {
    return this.discussionsService.upvote(id, userId);
  }
  // @UseGuards(JwtAuthGuard)
  @Post(':id/comment')
  addComment(@Param('id') id: any, @Req() req:any, @Body() body: { user:any, text: any }) {
    console.log("hreeeeeeeeeeee")
    return this.discussionsService.addComment(id, body.user, body.text);
  }
}
