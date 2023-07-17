export interface TranslationService {
  translateVariable(koreanWord: string, userId: string): Promise<string>;
  recommandVariable(koreanWord: string, userId: string): Promise<string>;
}
