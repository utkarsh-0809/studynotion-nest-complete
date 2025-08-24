// user.resolver.ts
import { Resolver, Query } from '@nestjs/graphql';
import { UserInfo } from './query1';
import { UserService } from 'src/user/user.service';
import { CourseService } from 'src/course/course.service';


@Resolver(() => UserInfo)
export class UserResolver {
  constructor(private userService: UserService,
    private courseService:CourseService) {}

  @Query(() => [UserInfo])
  async getAllUsers(): Promise<UserInfo[]> {
    const users = await this.userService.findAll();
    // console.log(users);
    // Enrich users with their respective role-based info
    return Promise.all(
      users.map(async (user:any) => {
        const baseInfo: any = {
          id: user._id.toString(),
          name: `${user.firstName} ${user.lastName}`,
          email:user.email,
          accountType: user.accountType,
        };

        if (user.accountType === 'Instructor') {
          baseInfo.coursesSoldCount = user.courses.length;
          baseInfo.coursesSoldValue =await this.courseService.getCoursesValue(user.id);
        
        } else if (user.accountType === 'Student') {
          baseInfo.coursesBoughtCount = user.courses.length;
        }

        return baseInfo;
      }),
    );
  }
}
