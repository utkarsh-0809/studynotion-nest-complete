import { forwardRef, Module } from '@nestjs/common';
import { RatingandreviewService } from './ratingandreview.service';
import { RatingandreviewController } from './ratingandreview.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RatingAndReview, RatingAndReviewSchema } from './models/ratingsandreview';
import { CourseModule } from 'src/course/course.module';
import { Course, CourseSchema } from 'src/course/models/course.schme';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RatingAndReview.name, schema: RatingAndReviewSchema },
      { name: Course.name, schema: CourseSchema },
    ]),
    forwardRef(() => CourseModule),
    // CourseModule
  ],
  controllers: [RatingandreviewController],
  providers: [RatingandreviewService],
})
export class RatingandreviewModule {}
