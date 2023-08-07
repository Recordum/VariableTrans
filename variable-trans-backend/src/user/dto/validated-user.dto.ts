import { User } from '../entity/user.entity';

export class ValidatedUserDto {
  private userId: string;
  private grade: string;
  private requsetLimit: number;

  constructor(user: User) {
    this.userId = user.Id;
    this.grade = user.grade;
    this.requsetLimit = user.requestLimit;
  }

  public getUserId(): string {
    return this.userId;
  }
  public getGrade(): string {
    return this.grade;
  }
  public getRequestLimit(): number {
    return this.requsetLimit;
  }
}
