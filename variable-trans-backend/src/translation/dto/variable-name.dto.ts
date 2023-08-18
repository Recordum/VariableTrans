export class VariableNameDto {
  private snakeCase: string;
  private camelCase: string;
  private pascalCase: string;

  constructor(snakeCase: string, camelCase: string, pascalCase: string) {
    this.snakeCase = snakeCase;
    this.camelCase = camelCase;
    this.pascalCase = pascalCase;
  }
}
