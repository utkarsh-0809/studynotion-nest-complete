import { forwardRef, Module } from '@nestjs/common';
import { SectionService } from './section.service';
import { SectionController } from './section.controller';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Section, SectionSchema } from './models/section.schema';
import { CourseModule } from 'src/course/course.module';
import { SubSection } from 'src/subsection/models/subsection.schema';
import { SubsectionModule } from 'src/subsection/subsection.module';
import {  SubSectionSchema } from 'src/subsection/models/subsection.schema';
import { Course, CourseSchema } from 'src/course/models/course.schme';

@Module({
  imports: [MongooseModule.forFeature([{ name: Section.name, schema: SectionSchema },
    { name: SubSection.name, schema: SubSectionSchema },
    { name: Course.name, schema: CourseSchema},
  ]),
  // CourseModule,SubsectionModule,
  forwardRef(() => SubsectionModule),
  forwardRef(() => CourseModule)
],
  controllers: [SectionController],
  providers: [SectionService],
})
export class SectionModule {}
