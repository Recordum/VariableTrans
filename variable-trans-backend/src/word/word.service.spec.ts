import { Test, TestingModule } from '@nestjs/testing';
import { WordServiceImpl } from './word.service.impl';
import { CacheMapWordService } from './cache-word/implementation/cache-map-word.service';

describe('WordService', () => {
  let service: WordServiceImpl;
  let wordRepository: jest.Mocked<WordRepository>;
  let cacheWordService: CacheMapWordService;
  let KOREAN: string;
  let WORD: string;

  beforeEach(async () => {
    wordRepository = {
      findWordByKorean: jest.fn(),
      saveWord: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WordServiceImpl,
        { provide: 'CacheWordService', useClass: CacheMapWordService },
        { provide: 'WordRepository', useValue: wordRepository },
      ],
    }).compile();

    service = module.get<WordServiceImpl>(WordServiceImpl);
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
      wordRepository.findWordByKorean.mockResolvedValue(WORD);

      const foundWord: string = await service.findWord(KOREAN);

      expect(foundWord).toBe(WORD);
      expect(wordRepository.findWordByKorean).toHaveBeenCalled();
    });

    it('word가 Repoistory에 존재하지 않을떄 undefined 반환', async () => {
      wordRepository.findWordByKorean.mockResolvedValue(undefined);
      const foundWord: string = await service.findWord(KOREAN);

      expect(foundWord).toBeUndefined();
      expect(wordRepository.findWordByKorean).toHaveBeenCalled();
    });
  });
});
