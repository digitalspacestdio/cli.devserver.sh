import { Test, TestingModule } from '@nestjs/testing';
import { AppwriteService } from './appwrite.service';

describe('Appwrite', () => {
  let provider: AppwriteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppwriteService],
    }).compile();

    provider = module.get<AppwriteService>(AppwriteService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
