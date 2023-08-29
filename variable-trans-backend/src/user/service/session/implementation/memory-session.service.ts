import { SessionDataDto } from '../../../dto/session-data.dto';
import { SessionService } from '../session.service';
import { SetSessionDto } from '../../../dto/set-session.dto';

export class MemorySessionService implements SessionService {
  private sessionDataMap: Map<string, SessionDataDto> = new Map();
  public async getSessionData(sessionId: string): Promise<SessionDataDto> {
    return this.sessionDataMap.get(sessionId);
  }
  public async setSessionData(setSessionDto: SetSessionDto): Promise<void> {
    this.sessionDataMap.set(
      setSessionDto.getSessionId(),
      SessionDataDto.fromSetSessionData(setSessionDto),
    );
  }
  public async deleteSessionData(sessionId: string): Promise<void> {
    this.sessionDataMap.delete(sessionId);
  }
}
