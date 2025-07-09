import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { RatingandreviewService } from './ratingandreview.service';
import { CreateRatingandreviewDto } from './dto/create-ratingandreview.dto';
import { UpdateRatingandreviewDto } from './dto/update-ratingandreview.dto';
import { JwtAuthGuard } from 'src/common/gaurds/jwtauthgaurd';
import { RolesGuard } from 'src/common/gaurds/rolesgaurd';
import { Roles } from 'src/common/decorator/roles';
import { Request } from 'express';

@Controller('/api/v1/course')
export class RatingandreviewController {
  constructor(private readonly ratingandreviewService: RatingandreviewService) {}

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('Student')
  @Post('createRating')
  async create(@Req() req:any) {
    return await this.ratingandreviewService.createRating(req);
  }

  @Get('getReviews')
  async findAll() {
    return await this.ratingandreviewService.getAllRatingReview();
  }

  @Get('getAverageRating')
  async average(@Req() req:any) {
    return await this.ratingandreviewService.getAverageRating(req);
  }

 
}
