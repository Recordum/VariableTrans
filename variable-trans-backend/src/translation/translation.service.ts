import { Inject, Injectable } from '@nestjs/common';
import { Translator } from './translator/translator';
import { WordService } from 'src/word/word.service';

@Injectable()
export class TranslationService {
  constructor(
    @Inject('Translator')
    private readonly translator: Translator,
    @Inject('WordService')
    private readonly wordService: WordService,
  ) {}

  public async translateVariable(korean: string): Promise<string> {
    let variable: string = await this.wordService.getVariable(korean);
    if (variable) {
      return variable;
    }

    variable = await this.translator.translateVariable(korean);
    await this.wordService.saveVariable(korean, variable);
    return variable;
  }

  public recommandVariable(contents: string, userId: string): Promise<string> {
    throw new Error('MUST IMPLEMNT ');
  }
}
