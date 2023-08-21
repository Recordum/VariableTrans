import { Inject, Injectable } from '@nestjs/common';
import { Translator } from './translator/translator';
import { WordService } from 'src/word/word.service';
import { VariableNameDto } from './dto/variable-name.dto';

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
    let variable: string = await this.wordService.getVariable(korean);

    if (variable) {
      console.log(`wordModule 변수명 : ${variable}`);
      return this.convertToNamingConventions(variable);
    }

    variable = await this.translator.translateVariable(korean);

    console.log(`translator 변수명 : ${variable}`);
    await this.wordService.saveVariable(korean, variable);
    return this.convertToNamingConventions(variable);
  }

  public recommendVariable(contents: string, userId: string): Promise<string> {
    throw new Error('MUST IMPLEMNT ');
  }

  private removeSpacing(korean: string): string {
    return korean.split(' ').join('');
  }

  private convertToNamingConventions(variable: string) {
    const snakeCase: string = this.convertToSnakeCase(variable);
    const camelCase: string = this.convertToCamelCase(variable);
    const pascalCase: string = this.convertToPascalCase(variable);

    return new VariableNameDto(snakeCase, camelCase, pascalCase);
  }

  private convertToSnakeCase(variable: string): string {
    return variable
      .split(' ')
      .map((word) => word.charAt(0).toLowerCase() + word.slice(1))
      .join('_');
  }
  private convertToCamelCase(variable: string): string {
    const words = variable.split(' ');
    const firstWord = words[0].toLowerCase();
    const restOfWords = words
      .slice(1)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');

    return firstWord + restOfWords;
  }

  private convertToPascalCase(variable: string): string {
    return variable
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }
}
