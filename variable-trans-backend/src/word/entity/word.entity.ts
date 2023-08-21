import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('word')
export class Word {
  @PrimaryColumn()
  korean: string;

  @Column({ name: 'variable', type: 'varchar', length: '64' })
  variable: string;

  @Column({ name: 'count', type: 'int', default: 0 })
  count: number;

  constructor(korean: string, variable: string) {
    this.korean = korean;
    this.variable = variable;
  }

  public convertToSnakeCase(): string {
    return this.variable
      .split(' ')
      .map((word) => word.charAt(0).toLowerCase() + word.slice(1))
      .join('_');
  }

  public convertToCamelCase(): string {
    const words = this.variable.split(' ');
    const firstWord = words[0].toLowerCase();
    const restOfWords = words
      .slice(1)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');

    return firstWord + restOfWords;
  }

  public convertToPascalCase(): string {
    return this.variable
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }
}
