import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscription } from '@nestjs/graphql';
import { SubscriptionSchema } from './model/subscription.schema';
import { User } from 'src/user/model/User';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
    UserModule
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
})
export class SubscriptionModule {}
