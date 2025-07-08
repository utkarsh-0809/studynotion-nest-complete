import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsArray,
  IsMongoId,
  IsEnum,
  IsNumber,
} from 'class-validator';

export class CreateCourseDto {
  @IsString()
  @IsOptional()
  courseName?: string;

  @IsString()
  @IsOptional()
  courseDescription?: string;

  @IsMongoId()
  instructor: string;

  @IsString()
  @IsOptional()
  whatYouWillLearn?: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  courseContent?: string[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  ratingAndReviews?: string[];

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  tag: string[];

  @IsMongoId()
  @IsOptional()
  category?: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  studentsEnroled?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  instructions?: string[];

  @IsEnum(['Draft', 'Published'])
  @IsOptional()
  status?: string;
}
