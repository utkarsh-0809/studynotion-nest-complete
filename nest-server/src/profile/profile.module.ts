import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { Profile, ProfileSchema } from './models/Profile';
import { UserModule } from 'src/user/user.module';
import { CourseModule } from 'src/course/course.module';
import { Courseprogress, CourseprogressSchema } from 'src/courseprogress/models/courseprogerss';
import { CourseprogressModule } from 'src/courseprogress/courseprogress.module';
import { Course, CourseSchema } from 'src/course/models/course.schme';
import { User, UserSchema } from 'src/user/model/User';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService],
  exports:[ProfileService],
  imports: [
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema },
      { name: Course.name, schema: CourseSchema },
      { name: User.name, schema: UserSchema },
      { name: Courseprogress.name, schema: CourseprogressSchema },
      // { name: User.name, schema: UserSchema },
    ]),
    // UserModule,CourseModule,CourseprogressModule,
    forwardRef(() => CourseprogressModule),
      forwardRef(() => CourseModule),
      forwardRef(() => UserModule)
  ],
})
export class ProfileModule {}
