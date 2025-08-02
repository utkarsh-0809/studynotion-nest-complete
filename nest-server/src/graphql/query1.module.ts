import { Module } from "@nestjs/common";
import { UserResolver } from "./query1resolver";
import { UserSchema } from "src/user/model/User";
import { UserService } from "src/user/user.service";
import { UserModule } from "src/user/user.module";
import { CourseModule } from "src/course/course.module";

@Module({
  imports:[UserModule,CourseModule],
  providers: [UserResolver],
})
export class Query1Module {}
