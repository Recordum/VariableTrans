import { User } from 'src/user/entity/user.entity';

export class SetSessionDto {
  private readonly sessionId: string;
  private readonly user: User;

  public constructor(builder: SetSessionDtoBuilder) {
    this.sessionId = builder.sessionId;
    this.user = builder.user;
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getUser(): User {
    return this.user;
  }
}

export class SetSessionDtoBuilder {
  public sessionId: string;
  public user: User;

  public setSessionId(sessionId: string): this {
    this.sessionId = sessionId;
    return this;
  }

  public setUser(user: User): this {
    this.user = user;
    return this;
  }

  public build(): SetSessionDto {
    return new SetSessionDto(this);
  }
}
