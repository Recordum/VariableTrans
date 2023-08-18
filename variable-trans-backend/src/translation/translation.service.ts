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
    let variable: string = await this.wordService.getVariable(korean);
    if (variable) {
      return this.convertToNamingConventions(variable);
    }

    variable = await this.translator.translateVariable(korean);
    await this.wordService.saveVariable(korean, variable);
    return this.convertToNamingConventions(variable);
  }

  public recommandVariable(contents: string, userId: string): Promise<string> {
    throw new Error('MUST IMPLEMNT ');
  }

  private convertToNamingConventions(variable: string) {
    const snakeCase: string = this.convertToSnakeCase(variable);
    const camelCase: string = this.convertToCamelCase(variable);
    const pascalCase: string = this.convertToPascalCase(variable);

    return new VariableNameDto(snakeCase, camelCase, pascalCase);
  }

  private convertToSnakeCase(variable: string): string {
    return variable
      .trim()
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/\s+/g, '_')
      .toLowerCase();
  }
  private convertToCamelCase(variable: string): string {
    return variable
      .trim()
      .replace(/(\s+)([a-z])/g, (_, __, letter) => letter.toUpperCase())
      .replace(/^\w/, (first) => first.toLowerCase());
  }
  private convertToPascalCase(variable: string): string {
    return variable
      .trim()
      .replace(/(\s+)([a-z])/g, (_, __, letter) => letter.toUpperCase())
      .replace(/^\w/, (first) => first.toUpperCase());
  }
}
