import { SetSessionDto } from './dto/set-session.dto';

export interface SessionService {
  getSessionData(sessionId: string): Promise<SetSessionDto>;
  setSessionData(setSessionDto: SetSessionDto): Promise<void>;
  deleteSessionData(sessionId: string): Promise<void>;
}
