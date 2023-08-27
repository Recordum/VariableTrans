import { HttpService } from '@nestjs/axios';
import { Translator } from '../translator';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PaPagoTranslator implements Translator {
  constructor(private httpService: HttpService) {}

  public async translateVariable(korean: string): Promise<string> {
    const api_url = process.env.PAPAGO_API;

    const headers = {
      'X-Naver-Client-Id': process.env.CLIENT_ID,
      'X-Naver-Client-Secret': process.env.CLIENT_SECRET,
    };

    const data = {
      source: 'ko',
      target: 'en',
      text: korean,
    };

    const response = await this.httpService.axiosRef.post(api_url, data, {
      headers,
    });
    return response.data.message.result.translatedText;
    // return 'test_Variable';
  }
}
