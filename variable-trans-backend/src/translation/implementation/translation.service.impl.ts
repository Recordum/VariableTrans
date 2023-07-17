import { WordCacheService } from 'src/word-cache/word-cache.service';
import { Inject, Injectable } from '@nestjs/common';
import { RequestTranslation } from '../request-translation/request-translation';
import { TranslationService } from '../translation.service';

@Injectable()
export class TranslationServiceImpl implements TranslationService {
  constructor(
    @Inject('RequestTranslation')
    private readonly requestTranslation: RequestTranslation,
    @Inject('WordCacheService')
    private readonly wordCacheService: WordCacheService,
  ) {}

  public async translateVariable(
    koreanVariable: string,
    userId: string,
  ): Promise<string> {
    if (this.wordCacheService.isWordCached(koreanVariable)) {
      console.log('cached');
      return this.wordCacheService.getCachedVariable(koreanVariable);
    }
    const variable = await this.requestTranslation.translateVariable(
      koreanVariable,
    );
    this.wordCacheService.setWordCached(koreanVariable, variable);
    return variable;
  }

  public recommandVariable(contents: string, userId: string): Promise<string> {
    return this.requestTranslation.recommandVariable(contents);
  }
}
