// export class CreateRatingandreviewDto {}
import { IsMongoId, IsNotEmpty, IsNumber, IsString, Min, Max } from 'class-validator';

export class CreateRatingandreviewDto {
  @IsMongoId()
  @IsNotEmpty()
  user: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  review: string;

  @IsMongoId()
  @IsNotEmpty()
  course: string;
}
