import { IsString, IsArray, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  sectionName: string;

  @IsArray()
  @IsMongoId({ each: true })
  subSection: string[];
}
