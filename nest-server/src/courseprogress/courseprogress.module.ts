import { forwardRef, Module } from '@nestjs/common';
import { CourseprogressService } from './courseprogress.service';
import { CourseprogressController } from './courseprogress.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Courseprogress, CourseprogressSchema } from './models/courseprogerss';
import { SubsectionModule } from 'src/subsection/subsection.module';
import { SubSection, SubSectionSchema } from 'src/subsection/models/subsection.schema';
// { name: SubSection.name, schema: SubSectionSchema },
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Courseprogress.name, schema: CourseprogressSchema },
      { name: SubSection.name, schema: SubSectionSchema },
    ]),
    // SubsectionModule,
    forwardRef(() => SubsectionModule)
  ],
  controllers: [CourseprogressController],
  providers: [CourseprogressService],
})
export class CourseprogressModule {}

