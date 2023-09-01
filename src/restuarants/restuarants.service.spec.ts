import { Test, TestingModule } from '@nestjs/testing';
import { RestuarantsService } from './restuarants.service';

describe('RestuarantsService', () => {
  let service: RestuarantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestuarantsService],
    }).compile();

    service = module.get<RestuarantsService>(RestuarantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
