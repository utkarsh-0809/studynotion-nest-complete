import { Test, TestingModule } from '@nestjs/testing';
import { RatingandreviewController } from './ratingandreview.controller';
import { RatingandreviewService } from './ratingandreview.service';

describe('RatingandreviewController', () => {
  let controller: RatingandreviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatingandreviewController],
      providers: [RatingandreviewService],
    }).compile();

    controller = module.get<RatingandreviewController>(RatingandreviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
