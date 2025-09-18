import { PartialType } from '@nestjs/mapped-types';
import { CreateSubscribedDto } from './create-subscribed.dto';

export class UpdateSubscribedDto extends PartialType(CreateSubscribedDto) {}
