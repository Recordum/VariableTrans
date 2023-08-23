import { Word } from '../../../entity/word.entity';
import { CacheMapWordService } from './cache-map-word.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('CacheMapWordService', () => {
  let service: CacheMapWordService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CacheMapWordService],
    }).compile();

    service = module.get<CacheMapWordService>(CacheMapWordService);
  });
  describe('setWord', () => {
    it('단어를 캐시 Map 에 저장', async () => {
      const word: Word = new Word('안녕', 'hello');
      await service.setWord('안녕', word);
      const result: Word = await service.getWord('안녕');

      expect(result).toEqual(word);
    });
  });

  describe('deletedWord', () => {
    it('캐시 Map 에서 단어 삭제, 없는 단어를 캐시에서 찾을시 Error 발생', async () => {
      const word: Word = new Word('안녕', 'hello');
      await service.setWord('안녕', word);

      await service.deleteWord('안녕');

      await expect(service.getWord('안녕')).rejects.toThrowError();
    });
  });

  describe('IsCachedWord', () => {
    it('캐싱 되어있는 단어일 경우 true 반환', async () => {
      const word: Word = new Word('안녕', 'hello');
      await service.setWord('안녕', word);

      const result: boolean = await service.isCachedWord('안녕');

      expect(result).toBe(true);
    });
  });

  describe('getTrackedWord', () => {
    it('set에 저장된 한국어를 key로 하는 value를 Map에서 전부 찾아 배열로 반환', async () => {
      const newWord1 = new Word('안녕1', 'hello1');
      const newWord2 = new Word('안녕2', 'hello2');
      const newWord3 = new Word('안녕3', 'hello3');
      await service.trackWord(newWord1);
      await service.trackWord(newWord2);
      await service.trackWord(newWord3);

      await service.setWord('안녕1', newWord1);
      await service.setWord('안녕2', newWord2);
      await service.setWord('안녕3', newWord3);

      const trackedWords: Word[] = await service.getTrackedWords();

      expect(trackedWords).toEqual([newWord1, newWord2, newWord3]);
    });
  });
});
