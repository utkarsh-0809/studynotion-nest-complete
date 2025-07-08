// export class CreateCourseprogressDto {}
import { IsMongoId, IsArray, IsOptional } from 'class-validator';

export class CreateCourseprogressDto {
  @IsMongoId()
  courseID: string;

  @IsMongoId()
  userId: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  completedVideos?: string[];
}
