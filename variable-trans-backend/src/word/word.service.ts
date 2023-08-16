export interface WordService {
  getVariable(korean: string): Promise<string>;
  saveVariable(korean: string, variable: string): Promise<void>;
}
