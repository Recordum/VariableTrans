import { Inject, Injectable } from '@nestjs/common';
import { RequestTranslation } from './request-translation/request-translation';
import { WordCacheService } from 'src/word-cache/word-cache.service';

@Injectable()
export class TranslationService {
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
    // if (this.requestUsage.isOverUsage(userId)) {
    //   return '일일 사용량이 초과 되었습니다';
    // }
    if (this.wordCacheService.isWordCached(koreanVariable)) {
      console.log('cached');
      //word 요청 횟수 count 추가하는 메소드
      return this.wordCacheService.getCachedVariable(koreanVariable);
    }
    //MongoDB 연결
    // const variable = await this.wordService.findWord(koreanVariable);

    // if (variable !== undefined) {
    //   this.wordCacheService.setWordCached(koreanVariable, variable);
    //   return variable;
    // }

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
