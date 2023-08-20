import { IsString, Length, Matches } from 'class-validator';

export class KoreanDto {
  @IsString()
  @Length(2, 30)
  @Matches(/^[^a-zA-Z]*$/)
  private korean: string;

  constructor(korean: string) {
    this.korean = korean;
  }

  public getKorean(): string {
    return this.korean;
  }
}
