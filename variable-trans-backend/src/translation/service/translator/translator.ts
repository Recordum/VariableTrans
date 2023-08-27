export interface Translator {
  translateVariable(korean: string): Promise<string>;
}
