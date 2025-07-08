import { PartialType } from '@nestjs/mapped-types';
import { CreateRatingandreviewDto } from './create-ratingandreview.dto';

export class UpdateRatingandreviewDto extends PartialType(CreateRatingandreviewDto) {}
