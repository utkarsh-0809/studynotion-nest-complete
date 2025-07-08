import { PartialType } from '@nestjs/mapped-types';
import { CreateSubsectionDto } from './create-subsection.dto';

export class UpdateSubsectionDto extends PartialType(CreateSubsectionDto) {}
