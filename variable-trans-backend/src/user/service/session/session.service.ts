import { SessionDataDto } from 'src/user/dto/session-data.dto';
import { SetSessionDto } from '../../dto/set-session.dto';

export interface SessionService {
  getSessionData(sessionId: string): Promise<SessionDataDto>;
  setSessionData(setSessionDto: SetSessionDto): Promise<void>;
  deleteSessionData(sessionId: string): Promise<void>;
}
