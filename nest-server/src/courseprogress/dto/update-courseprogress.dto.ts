import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseprogressDto } from './create-courseprogress.dto';

export class UpdateCourseprogressDto extends PartialType(CreateCourseprogressDto) {}
