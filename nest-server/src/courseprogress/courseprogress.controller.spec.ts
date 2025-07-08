import { Test, TestingModule } from '@nestjs/testing';
import { CourseprogressController } from './courseprogress.controller';
import { CourseprogressService } from './courseprogress.service';

describe('CourseprogressController', () => {
  let controller: CourseprogressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseprogressController],
      providers: [CourseprogressService],
    }).compile();

    controller = module.get<CourseprogressController>(CourseprogressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
