import { Module } from '@nestjs/common';
import { SubscribedService } from './subscribed.service';
import { SubscribedController } from './subscribed.controller';
import { MailService } from 'src/common/mailsender/sendmail';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscribed, SubscribedSchema } from './model/subscribed.model';
import { User, UserSchema } from 'src/user/model/User';

@Module({
  controllers: [SubscribedController],
  providers: [SubscribedService,MailService],
  imports: [  UserModule,
    MongooseModule.forFeature([
      { name: Subscribed.name, schema: SubscribedSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ]
})
export class SubscribedModule {}
