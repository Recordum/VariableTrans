import { WordCacheMapService } from './word-cache-map.service';

describe('WordCacheMapService', () => {
  const service: WordCacheMapService = new WordCacheMapService();

  it('should set and get cached word', () => {
    service.setWordCached('안녕', 'hello');
    expect(service.getCachedVariable('안녕')).toBe('hello');
  });

  it('should delete cached word', () => {
    service.setWordCached('안녕', 'hello');
    service.deleteWordCached('안녕');
    expect(() => service.getCachedVariable('안녕')).toThrowError(Error);
  });

  it('should return true exist cached word', () => {
    service.setWordCached('안녕', 'hello');
    expect(service.isWordCached('안녕')).toBe(true);
  });
});
