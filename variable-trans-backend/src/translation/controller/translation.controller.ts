import { AuthGuard } from 'src/user/service/auth/auth-guard';
import { KoreanDto } from '../dto/Korean.dto';
import { VariableNameDto } from '../dto/variable-name.dto';
import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { TranslationService } from '../service/translation.service';

@Controller('translation')
export class TranslationController {
  constructor(private readonly translationService: TranslationService) {}

  @Get()
  @UseGuards(AuthGuard)
  async translate(@Query() koreanDto: KoreanDto): Promise<VariableNameDto> {
    return await this.translationService.translateVariable(
      koreanDto.getKorean(),
    );
  }
}
