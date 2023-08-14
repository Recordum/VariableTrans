import { Translator } from './translator/translator';
import { TranslationService } from './translation.service';
import { Test, TestingModule } from '@nestjs/testing';
import { WordService } from 'src/word/word.service';

describe('translationService', () => {
  let service: TranslationService;
  let wordService: jest.Mocked<WordService>;
  let translator: jest.Mocked<Translator>;

  beforeEach(async () => {
    wordService = {
      findWord: jest.fn(),
      saveWord: jest.fn(),
    };
    translator = {
      translateVariable: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TranslationService,
        { provide: 'WordService', useValue: wordService },
        { provide: 'Translator', useValue: translator },
      ],
    }).compile();

    service = module.get<TranslationService>(TranslationService);
  });
  describe('translateVariable', () => {
    it('wordService 에 word가 있을 시 WordService에서 반환', async () => {
      wordService.findWord.mockResolvedValue('hello');

      const result = await service.translateVariable('안녕');

      expect(result).toBe('hello');
      expect(translator.translateVariable).not.toHaveBeenCalled();
    });

    it('wordService 에 word가 없을시 translaotr에서 반환', async () => {
      wordService.findWord.mockResolvedValue(undefined);
      translator.translateVariable.mockResolvedValue('hello');

      const result = await service.translateVariable('안녕');

      expect(result).toBe('hello');
      expect(wordService.findWord).toHaveBeenCalledWith('안녕');
      expect(translator.translateVariable).toHaveBeenCalledWith('안녕');
    });
  });
});
