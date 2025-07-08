import { Test, TestingModule } from '@nestjs/testing';
import { RatingandreviewService } from './ratingandreview.service';

describe('RatingandreviewService', () => {
  let service: RatingandreviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RatingandreviewService],
    }).compile();

    service = module.get<RatingandreviewService>(RatingandreviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
