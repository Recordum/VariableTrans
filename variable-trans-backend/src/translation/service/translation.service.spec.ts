import { TranslationService } from './translation.service';
import { Test, TestingModule } from '@nestjs/testing';
import { VariableNameDto } from '../dto/variable-name.dto';
import { Word } from '../../word/entity/word.entity';
import { WordService } from 'src/word/service/word.service';
import { Translator } from './translator/translator';

describe('translationService', () => {
  let service: TranslationService;
  let wordService: jest.Mocked<WordService>;
  let translator: jest.Mocked<Translator>;
  let KOREAN: string;
  let VARIABLE: string;
  let SNAKE_CASE: string;
  let CAMEL_CASE: string;
  let PASCAL_CASE: string;
  beforeEach(async () => {
    wordService = {
      getWord: jest.fn(),
      saveWord: jest.fn(),
      createWord: jest.fn(),
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
    KOREAN = '변수명을 추천하다';
    VARIABLE = 'recommend variable name';
    SNAKE_CASE = 'recommend_variable_name';
    CAMEL_CASE = 'recommendVariableName';
    PASCAL_CASE = 'RecommendVariableName';
  });
  describe('translateVariable', () => {
    it('wordService 에 번역된 변수명을 네이밍 컨벤션으로 변환하여 반환', async () => {
      wordService.getWord.mockResolvedValue(new Word(KOREAN, VARIABLE));

      const result = await service.translateVariable(KOREAN);

      expect(result).toEqual(
        new VariableNameDto(SNAKE_CASE, CAMEL_CASE, PASCAL_CASE),
      );
    });

    it('wordService에서 변수명을 반환할떄 translator를 호출하지 않음', async () => {
      wordService.getWord.mockResolvedValue(new Word(KOREAN, VARIABLE));

      await service.translateVariable(KOREAN);

      expect(translator.translateVariable).not.toHaveBeenCalled();
    });

    it('wordService에서 변수명을 반환하지 못할떄 translaotr에서 변수명 반환', async () => {
      wordService.getWord.mockResolvedValue(undefined);
      translator.translateVariable.mockResolvedValue(VARIABLE);
      wordService.createWord.mockReturnValue(new Word(KOREAN, VARIABLE));

      await service.translateVariable(KOREAN);

      expect(translator.translateVariable).toHaveBeenCalled();
    });
  });
});
