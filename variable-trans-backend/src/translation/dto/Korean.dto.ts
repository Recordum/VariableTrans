import { IsString, Length, Matches } from 'class-validator';

export class KoreanDto {
  @IsString()
  @Length(2, 30)
  @Matches(/^[가-힣\s]*$/)
  private korean: string;

  constructor(korean: string) {
    this.korean = korean;
  }

  public getKorean(): string {
    return this.korean;
  }
}
