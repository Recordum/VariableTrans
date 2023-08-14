import { CacheMapWordService } from './cache-map-word.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('WordCacheMapService', () => {
  let service: CacheMapWordService = new CacheMapWordService();
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CacheMapWordService],
    }).compile();

    service = module.get<CacheMapWordService>(CacheMapWordService);
  });

  it('setWordCached: 단어를 캐시 Map 에 저장', () => {
    service.setWord('안녕', 'hello');
    expect(service.getWord('안녕')).toBe('hello');
  });

  it('deletWordCached : 캐시 Map 에서 단어 삭제, 없는 단어를 캐시에서 찾을시 Error 발생', () => {
    service.setWord('안녕', 'hello');
    service.deleteWord('안녕');
    expect(() => service.getWord('안녕')).toThrowError(Error);
  });

  it('IsWordCached : 캐시되어있는 단어에 true 반환', () => {
    service.setWord('안녕', 'hello');
    expect(service.isCachedWord('안녕')).toBe(true);
  });
});
