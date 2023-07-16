import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TranslationService } from './translation/translation.service';
import { TranslationController } from './translation/translation.controller';
import { TranslationModule } from './translation/translation.module';

@Module({
  imports: [TranslationModule],
  controllers: [AppController, TranslationController],
  providers: [AppService, TranslationService],
})
export class AppModule {}
