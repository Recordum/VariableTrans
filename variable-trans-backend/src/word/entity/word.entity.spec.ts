import { VariableNameDto } from 'src/translation/dto/variable-name.dto';
import { Word } from './word.entity';

describe('Word', () => {
  const KOREAN = '변수명을 추천하다';
  const VARIABLE = 'recommend variable name';
  const SNAKE_CASE = 'recommend_variable_name';
  const CAMEL_CASE = 'recommendVariableName';
  const PASCAL_CASE = 'RecommendVariableName';
  let word: Word;
  beforeEach(async () => {
    word = new Word(KOREAN, VARIABLE);
  });

  describe('convertToSnakeCase', () => {
    it('word의 변수명을 snake Case로 반환 ', () => {
      const result: string = word.convertToSnakeCase();

      expect(result).toEqual(SNAKE_CASE);
    });
  });

  describe('convertToCamelCase', () => {
    it('word의 변수명을 Camel Case로 반환', () => {
      const result: string = word.convertToCamelCase();

      expect(result).toEqual(CAMEL_CASE);
    });
  });

  describe('convertToPascalCase', () => {
    it('word의 변수명을 Pascal Case로  반환', () => {
      const result: string = word.convertToPascalCase();

      expect(result).toEqual(PASCAL_CASE);
    });
  });
});
