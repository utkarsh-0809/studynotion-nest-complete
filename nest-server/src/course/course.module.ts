import { forwardRef, Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { Course, CourseSchema } from './models/course.schme';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from 'src/user/user.module';
import { Category, CategorySchema } from 'src/category/models/category.schema';
import { CategoryModule } from 'src/category/category.module';
import { CourseprogressModule } from 'src/courseprogress/courseprogress.module';
import { SectionModule } from 'src/section/section.module';
import { SubsectionModule } from 'src/subsection/subsection.module';
import { Courseprogress, CourseprogressSchema } from 'src/courseprogress/models/courseprogerss';
import { User, UserSchema } from 'src/user/model/User';
import { Section, SectionSchema } from 'src/section/models/section.schema';
import { SubSection, SubSectionSchema } from 'src/subsection/models/subsection.schema';
import { MailService } from 'src/common/mailsender/sendmail';

@Module({
   imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema },
      { name: Courseprogress.name, schema: CourseprogressSchema },
            { name: User.name, schema: UserSchema },
            { name: Section.name, schema: SectionSchema },
      { name: Category.name, schema: CategorySchema },
      { name: SubSection.name, schema: SubSectionSchema },
      // { name: User.name, schema: UserSchema },
    ]),
    // UserModule,CategoryModule,CourseprogressModule, SectionModule
    // ,SubsectionModule,
     forwardRef(() => UserModule),
    forwardRef(() => SectionModule),
    forwardRef(() => CourseprogressModule),
    forwardRef(() => CategoryModule),
    forwardRef(() => SubsectionModule),
    
  ],
  controllers: [CourseController],
  providers: [CourseService,MailService],
  exports:[CourseService]
})
export class CourseModule {}
