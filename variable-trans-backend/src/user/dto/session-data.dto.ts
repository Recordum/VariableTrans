import { runInThisContext } from 'vm';
import { SetSessionDto } from './set-session.dto';
export class SessionDataDto {
  private userId: string;

  private grade: string;

  private requestLimit: number;

  constructor(userId: string, grade: string, requestLimit: number) {
    this.userId = userId;
    this.grade = grade;
    this.requestLimit = requestLimit;
  }

  static fromSetSessionData(setSessionDto: SetSessionDto) {
    return new SessionDataDto(
      setSessionDto.getUserId(),
      setSessionDto.getGrade(),
      setSessionDto.getRequestLimit(),
    );
  }

  public getUserId(): string {
    return this.userId;
  }

  public getGrade(): string {
    return this.grade;
  }

  public getRequestLimit(): number {
    return this.requestLimit;
  }
}
