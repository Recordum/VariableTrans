import { KoreanDto } from './dto/Korean.dto';
import { VariableNameDto } from './dto/variable-name.dto';
import { TranslationService } from './translation.service';
import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';

@Controller('translation')
export class TranslationController {
  constructor(
    @Inject('TranslationService')
    private readonly translationService: TranslationService,
  ) {}

  @Get()
  async translate(@Query() koreanDto: KoreanDto): Promise<VariableNameDto> {
    return await this.translationService.translateVariable(
      koreanDto.getKorean(),
    );
  }
}
