import { TranslationService } from './translation.service';
import { Controller, Get, Inject, Query } from '@nestjs/common';

@Controller('translation')
export class TranslationController {
  constructor(
    @Inject('TranslationService')
    private readonly translationService: TranslationService,
  ) {}

  @Get()
  translate(@Query('koreanVariable') koreanVariable: string): Promise<string> {
    const userId = 'TEST';
    return this.translationService.translateVariable(koreanVariable);
  }
}
