import { WordCacheService } from 'src/word-cache/word-cache.service';
import { TranslationServiceImpl } from './implementation/translation.service.impl';
import { RequestTranslation } from './request-translation/request-translation';
import { Test, TestingModule } from '@nestjs/testing';

describe('TranslationService', () => {
  let service: TranslationServiceImpl;
  let requestTranslation: jest.Mocked<RequestTranslation>;
  let wordCacheService: jest.Mocked<WordCacheService>;

  beforeEach(async () => {
    requestTranslation = {
      translateVariable: jest.fn(),
      recommandVariable: jest.fn(),
    };

    wordCacheService = {
      isWordCached: jest.fn(),
      getCachedVariable: jest.fn(),
      setWordCached: jest.fn(),
      deleteWordCached: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranslationServiceImpl,
        {
          provide: 'RequestTranslation',
          useValue: requestTranslation,
        },
        {
          provide: 'WordCacheService',
          useValue: wordCacheService,
        },
      ],
    }).compile();

    service = module.get<TranslationServiceImpl>(TranslationServiceImpl);
  });

  describe('translationVariable', () => {
    it('Cache 에 존재하는 단어이면 변수명을 Cache에서 return', async () => {
      wordCacheService.isWordCached.mockReturnValue(true);
      wordCacheService.getCachedVariable.mockReturnValue('validateUserId');

      const result = await service.translateVariable(
        '사용자ID를 유효성 검사하다',
        'test-user',
      );

      expect(result).toBe('validateUserId');
      expect(wordCacheService.isWordCached).toHaveBeenCalledWith(
        '사용자ID를 유효성 검사하다',
      );
      expect(wordCacheService.getCachedVariable).toHaveBeenCalledWith(
        '사용자ID를 유효성 검사하다',
      );
      expect(requestTranslation.translateVariable).not.toHaveBeenCalled();
    });
  });

  it('Cache 에 존재하지 않는 단어 일때, 번역 API를 호출후 Cache에 저장', async () => {
    wordCacheService.isWordCached.mockReturnValue(false);
    requestTranslation.translateVariable.mockResolvedValue('validateUserId');

    const result = await service.translateVariable(
      '사용자ID를 유효성 검사하다',
      'test-user',
    );

    expect(result).toBe('validateUserId');
    expect(wordCacheService.getCachedVariable).not.toHaveBeenCalled();
    expect(requestTranslation.translateVariable).toHaveBeenCalledWith(
      '사용자ID를 유효성 검사하다',
    );
    expect(wordCacheService.setWordCached).toHaveBeenCalledWith(
      '사용자ID를 유효성 검사하다',
      'validateUserId',
    );
  });
});
