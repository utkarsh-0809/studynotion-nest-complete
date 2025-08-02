// user.model.ts
import { ObjectType, Field, ID, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class UserInfo {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;
   @Field()
  email: string;

  @Field()
  accountType: string;

  @Field(() => Int, { nullable: true })
  coursesSoldCount?: number;

  @Field(() => Float, { nullable: true })
  coursesSoldValue?: number;

  @Field(() => Int, { nullable: true })
  coursesBoughtCount?: number;
}
