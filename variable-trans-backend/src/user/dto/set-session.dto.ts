import { Exclude, Expose } from 'class-transformer';

export class SetSessionDto {
  @Exclude()
  private sessionId: string;
  @Expose()
  private userId: string;
  @Expose()
  private grade: string;
  @Expose()
  private requestLimit: number;

  public constructor(builder: SetSessionDtoBuilder) {
    this.sessionId = builder.sessionId;
    this.userId = builder.userId;
    this.grade = builder.grade;
    this.requestLimit = builder.requestLimit;
  }

  public getSessionId(): string {
    return this.sessionId;
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

export class SetSessionDtoBuilder {
  public sessionId: string;
  public userId: string;
  public grade: string;
  public requestLimit: number;

  public setSessionId(sessionId: string): this {
    this.sessionId = sessionId;
    return this;
  }

  public setUserId(userId: string): this {
    this.userId = userId;
    return this;
  }

  public setGrade(grade: string): this {
    this.grade = grade;
    return this;
  }

  public setRequestLimit(requestLimit: number): this {
    this.requestLimit = requestLimit;
    return this;
  }

  public build(): SetSessionDto {
    return new SetSessionDto(this);
  }
}
