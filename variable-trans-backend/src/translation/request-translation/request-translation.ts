export interface RequestTranslation {
  translateVariable(korean: string): Promise<string>;
  recommandVariable(contents: string): Promise<string>;
}
