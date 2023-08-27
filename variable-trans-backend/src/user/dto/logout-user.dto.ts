import { IsNotEmpty } from 'class-validator';

export class LogoutUserDto {
  @IsNotEmpty()
  private sessionId: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }
  public getSessionId(): string {
    return this.sessionId;
  }
}
