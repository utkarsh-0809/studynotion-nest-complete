import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { OtpModule } from './otp/otp.module';
import { ProfileModule } from './profile/profile.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CourseModule } from './course/course.module';
import { SectionModule } from './section/section.module';
import { SubsectionModule } from './subsection/subsection.module';
import { CategoryModule } from './category/category.module';
import { CourseprogressModule } from './courseprogress/courseprogress.module';
import { RatingandreviewModule } from './ratingandreview/ratingandreview.module';
import { MulterModule } from '@nestjs/platform-express';
import { ChatsModule } from './chats/chats.module';

import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { Query1Module } from './graphql/query1.module';
import { CacheModule } from './cache/cache.module';
@Module({
  imports: [UserModule, OtpModule, ProfileModule,
   
     ConfigModule.forRoot({
      isGlobal: true, // make it accessible everywhere
      envFilePath: '.env',
    }),
    //The ! tells TypeScript:“I promise this is defined.”
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    CourseModule,
    SectionModule,
    SubsectionModule,
    CategoryModule,
    CourseprogressModule,
    RatingandreviewModule,
    MulterModule.register({
      dest: './uploads',
    }),
    ChatsModule,
     GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'), // auto generates schema
      sortSchema: true,
      playground: true, // for local dev, enables GraphQL playground
    }),
    Query1Module,
    CacheModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
