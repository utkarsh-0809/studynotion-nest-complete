import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSubsectionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  timeDuration?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  videoUrl?: string;
}
