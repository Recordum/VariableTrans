import { Translator } from './translator/translator';
import { TranslationService } from './translation.service';
import { Test, TestingModule } from '@nestjs/testing';
import { WordService } from 'src/word/word.service';
import { VariableNameDto } from './dto/variable-name.dto';

describe('translationService', () => {
  let service: TranslationService;
  let wordService: jest.Mocked<WordService>;
  let translator: jest.Mocked<Translator>;
  let KOREAN;
  let VARIABLE;
  let SNAKE_CASE;
  let CAMEL_CASE;
  let PASCAL_CASE;
  beforeEach(async () => {
    wordService = {
      getVariable: jest.fn(),
      saveVariable: jest.fn(),
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
    it('wordService 에 word가 있을 시 WordService에서 네이밍 컨벤션으로 변환된 변수명 반환', async () => {
      wordService.getVariable.mockResolvedValue(VARIABLE);

      const result = await service.translateVariable(KOREAN);

      expect(result).toEqual(
        new VariableNameDto(SNAKE_CASE, CAMEL_CASE, PASCAL_CASE),
      );
      expect(translator.translateVariable).not.toHaveBeenCalled();
    });

    it('wordService 에 word가 없을시 translaotr에서 네이밍 컨벤션으로 변환된 변수명 반환', async () => {
      wordService.getVariable.mockResolvedValue(undefined);
      translator.translateVariable.mockResolvedValue(VARIABLE);

      const result = await service.translateVariable(KOREAN);

      expect(result).toEqual(
        new VariableNameDto(SNAKE_CASE, CAMEL_CASE, PASCAL_CASE),
      );
      expect(wordService.getVariable).toHaveBeenCalledWith(KOREAN);
      expect(translator.translateVariable).toHaveBeenCalledWith(KOREAN);
    });
  });
});
