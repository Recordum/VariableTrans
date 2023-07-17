import { HttpService } from '@nestjs/axios';
import { RequestTranslation } from '../request-translation';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RequestTranslationImpl implements RequestTranslation {
  constructor(private httpService: HttpService) {}

  public async translateVariable(korean: string): Promise<string> {
    const api_url = 'https://openapi.naver.com/v1/papago/n2mt';

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
  }

  public recommandVariable(contents: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
}
