import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
// import { DiscussionsService, DiscussService } from './discuss.service';
import { CreateDiscussDto } from './dto/create-discuss.dto';
import { UpdateDiscussDto } from './dto/update-discuss.dto';
import { DiscussionsService } from './discuss.service';

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

@Controller('discussions')
export class DiscussionsController {
  constructor(private readonly discussionsService: DiscussionsService) {}

  @Post()
  create(@Body() createDto: any) {
    console.log("createDto",createDto)
    return this.discussionsService.create(createDto);
  }

  @Get()
  findAll() {
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

  @Post(':id/comment')
  addComment(@Param('id') id: string, @Body() body: { user: string; text: string }) {
    return this.discussionsService.addComment(id, body.user, body.text);
  }
}
