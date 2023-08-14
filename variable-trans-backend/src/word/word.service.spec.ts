import { Test, TestingModule } from '@nestjs/testing';
import { CacheWordService } from './cache-word/cache-word.service';
import { WordService } from './word.service';
import { CacheMapWordService } from './cache-word/implementation/cache-map-word.service';

export class MockWordRepository implements WordRepository {
  findWordByKorean(korean: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
  saveWord(word: string, korean: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
describe('WordService', () => {
  let service: WordService;
  let wordRepository: MockWordRepository;
  let cacheWordService: CacheWordService;
  let KOREAN;
  let WORD;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WordService,
        { provide: 'WordRepository', useClass: MockWordRepository },
        { provide: 'CacheWordSerivce', useClass: CacheMapWordService },
      ],
    }).compile();

    service = module.get<WordService>(WordService);
    wordRepository = module.get<MockWordRepository>('WordRepository');
    cacheWordService = module.get<CacheMapWordService>('CacheWordService');
    KOREAN = '사용자';
    WORD = 'User';
  });

  describe('findWord', () => {
    it('word가 Caching 되어 있다면 Cache에서 반환', async () => {
      cacheWordService.setWord(KOREAN, WORD);

      const foundWord: string = await service.findWord(KOREAN);

      expect(foundWord).toBe(WORD);
      expect(wordRepository.findWordByKorean).not.toHaveBeenCalled();
    });

    it('word가 Cach 저장소에 없고, Repository에만 있을떄 Repsitory에서 반환', async () => {
      wordRepository.saveWord(WORD, KOREAN);

      const foundWord: string = await service.findWord(KOREAN);

      expect(foundWord).toBe(WORD);
      expect(wordRepository.findWordByKorean).toHaveBeenCalled();
    });

    it('word가 Repoistory에 존재하지 않을떄 undefined 반환', async () => {
      const foundWord: string = await service.findWord(KOREAN);

      expect(foundWord).toBeUndefined();
      expect(wordRepository.findWordByKorean).toHaveBeenCalled();
    });
  });
});
