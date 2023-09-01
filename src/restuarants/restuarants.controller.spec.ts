import { Test, TestingModule } from '@nestjs/testing';
import { RestuarantsController } from './restuarants.controller';

describe('RestuarantsController', () => {
  let controller: RestuarantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestuarantsController],
    }).compile();

    controller = module.get<RestuarantsController>(RestuarantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
