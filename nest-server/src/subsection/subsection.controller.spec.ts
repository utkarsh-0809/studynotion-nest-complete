import { Test, TestingModule } from '@nestjs/testing';
import { SubsectionController } from './subsection.controller';
import { SubsectionService } from './subsection.service';

describe('SubsectionController', () => {
  let controller: SubsectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubsectionController],
      providers: [SubsectionService],
    }).compile();

    controller = module.get<SubsectionController>(SubsectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
