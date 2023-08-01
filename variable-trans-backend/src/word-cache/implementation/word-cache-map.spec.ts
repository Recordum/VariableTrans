import { WordCacheMapService } from './word-cache-map.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('WordCacheMapService', () => {
  let service: WordCacheMapService = new WordCacheMapService();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WordCacheMapService],
    }).compile();

    service = module.get<WordCacheMapService>(WordCacheMapService);
  });

  it('setWordCached: 단어를 캐시 Map 에 저장', () => {
    service.setWordCached('안녕', 'hello');
    expect(service.getCachedVariable('안녕')).toBe('hello');
  });

  it('deletWordCached : 캐시 Map 에서 단어 삭제, 없는 단어를 캐시에서 찾을시 Error 발생', () => {
    service.setWordCached('안녕', 'hello');
    service.deleteWordCached('안녕');
    expect(() => service.getCachedVariable('안녕')).toThrowError(Error);
  });

  it('IsWordCached : 캐시되어있는 단어에 true 반환', () => {
    service.setWordCached('안녕', 'hello');
    expect(service.isWordCached('안녕')).toBe(true);
  });
});
