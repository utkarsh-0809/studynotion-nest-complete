import { Module } from '@nestjs/common';
import { DiscussionsController } from './discuss.controller';
import { DiscussionsService } from './discuss.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Discussion, DiscussionSchema } from './entities/discuss.entity';
import { User, UserSchema } from 'src/user/model/User';
// import { DiscussService } from './discuss.service';
// import { DiscussController } from './discuss.controller';

@Module({
  imports: [
      MongooseModule.forFeature([{ name: Discussion.name, schema: DiscussionSchema }]),
      MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      // CacheModule
    ],
  controllers: [DiscussionsController],
  providers: [DiscussionsService],
})
export class DiscussModule {}
