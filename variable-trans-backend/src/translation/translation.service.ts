import { Inject, Injectable } from '@nestjs/common';
import { Translator } from './translator/translator';
import { WordService } from 'src/word/word.service';
import { VariableNameDto } from './dto/variable-name.dto';
import { Word } from 'src/word/entity/word.entity';

@Injectable()
export class TranslationService {
  constructor(
    @Inject('Translator')
    private readonly translator: Translator,
    @Inject('WordService')
    private readonly wordService: WordService,
  ) {}

  public async translateVariable(korean: string): Promise<VariableNameDto> {
    korean = this.removeSpacing(korean);
    const word: Word = await this.wordService.getWord(korean);

    if (word) {
      return this.convertToNamingConventions(word);
    }

    const variable: string = await this.translator.translateVariable(korean);

    const newWord: Word = this.wordService.createWord(korean, variable);
    await this.wordService.saveWord(korean, newWord);
    return this.convertToNamingConventions(newWord);
  }

  public recommendVariable(contents: string, userId: string): Promise<string> {
    throw new Error('MUST IMPLEMNT ');
  }

  private removeSpacing(korean: string): string {
    return korean.split(' ').join('');
  }

  private convertToNamingConventions(word: Word) {
    const snakeCase: string = word.convertToSnakeCase();
    const camelCase: string = word.convertToCamelCase();
    const pascalCase: string = word.convertToPascalCase();

    return new VariableNameDto(snakeCase, camelCase, pascalCase);
  }
}
