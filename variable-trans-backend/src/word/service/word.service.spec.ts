import { Test, TestingModule } from '@nestjs/testing';
import { WordServiceImpl } from './word.service.impl';
import { WordRepository } from '../repository/word.repository';
import { CacheMapWordService } from './cache-word/implementation/cache-map-word.service';
import { Word } from '../entity/word.entity';
import { BatchService } from './batch/batch.service';

describe('WordService', () => {
  let service: WordServiceImpl;
  let wordRepository: jest.Mocked<WordRepository>;
  let cacheWordService: CacheMapWordService;
  let batchService: BatchService;
  let KOREAN: string;
  let VAR: string;

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
        BatchService,
      ],
    }).compile();

    service = module.get<WordServiceImpl>(WordServiceImpl);
    cacheWordService = module.get<CacheMapWordService>('CacheWordService');
    KOREAN = '사용자';
    VAR = 'User';
  });

  describe('findWord', () => {
    it('word가 Caching 되어 있다면 한국어에 대응하는 Word 반환', async () => {
      const word: Word = new Word(KOREAN, VAR);
      cacheWordService.setWord(KOREAN, word);

      const foudnWord: Word = await service.getWord(KOREAN);

      expect(foudnWord).toEqual(word);
    });
    it('word가 Caching 되어 있다면 Cache에서 반환', async () => {
      const word: Word = new Word(KOREAN, VAR);
      cacheWordService.setWord(KOREAN, word);

      await service.getWord(KOREAN);

      expect(wordRepository.findWordByKorean).not.toHaveBeenCalled();
    });

    it('word가 Cach 저장소에 없고, Repository에만 있을떄 Repsitory에서 반환', async () => {
      const word: Word = new Word(KOREAN, VAR);
      wordRepository.findWordByKorean.mockResolvedValue(word);

      await service.getWord(KOREAN);

      expect(wordRepository.findWordByKorean).toHaveBeenCalled();
    });

    it('word가 Repoistory에 존재하지 않을떄 undefined 반환', async () => {
      wordRepository.findWordByKorean.mockResolvedValue(undefined);
      const word: Word = await service.getWord(KOREAN);

      expect(word).toBeUndefined();
    });
  });
});
