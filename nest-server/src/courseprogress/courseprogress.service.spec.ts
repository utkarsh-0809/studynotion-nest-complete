import { Test, TestingModule } from '@nestjs/testing';
import { CourseprogressService } from './courseprogress.service';

describe('CourseprogressService', () => {
  let service: CourseprogressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseprogressService],
    }).compile();

    service = module.get<CourseprogressService>(CourseprogressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
