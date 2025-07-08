import { forwardRef, Module } from '@nestjs/common';
import { SubsectionService } from './subsection.service';
import { SubsectionController } from './subsection.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubSection, SubSectionSchema } from './models/subsection.schema';
import { SectionModule } from 'src/section/section.module';
import { Section, SectionSchema } from 'src/section/models/section.schema';
// import { forwardRef } from 'react';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SubSection.name, schema: SubSectionSchema },
      { name: Section.name, schema: SectionSchema },
            // { name: User.name, schema: UserSchema },
    ]),
    // SectionModule,
    forwardRef(() => SectionModule)
  ],
  controllers: [SubsectionController],
  providers: [SubsectionService],
  exports:[
    SubsectionModule
  ]
})
export class SubsectionModule {}
