import { Inject, Injectable } from '@nestjs/common';
import { Translator } from './translator/translator';

@Injectable()
export class TranslationService {
  constructor(
    @Inject('Translator')
    private readonly translator: Translator,
    @Inject('WordService')
    private readonly wordService: WordService,
  ) {}

  public async translateVariable(korean: string): Promise<string> {
    let word: string = await this.wordService.findWord(korean);
    if (word) {
      return word;
    }

    word = await this.translator.translateVariable(korean);
    await this.wordService.saveWord(korean, word);
    return word;
  }

  public recommandVariable(contents: string, userId: string): Promise<string> {
    throw new Error('MUST IMPLEMNT ');
  }
}
