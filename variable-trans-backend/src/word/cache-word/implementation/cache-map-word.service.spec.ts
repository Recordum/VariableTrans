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

  it('setWord: 단어를 캐시 Map 에 저장', async () => {
    await service.setWord('안녕', 'hello');
    expect(await service.getWord('안녕')).toBe('hello');
  });

  it('deletWord : 캐시 Map 에서 단어 삭제, 없는 단어를 캐시에서 찾을시 Error 발생', async () => {
    await service.setWord('안녕', 'hello');
    await service.deleteWord('안녕');
    await expect(service.getWord('안녕')).rejects.toThrowError();
  });

  it('IsWordCached : 캐시되어있는 단어에 true 반환', async () => {
    await service.setWord('안녕', 'hello');
    expect(await service.isCachedWord('안녕')).toBe(true);
  });
});
