import { SetSessionDto } from './dto/set-session.dto';

export interface SessionService {
  getSessionData(sessionId: string): Promise<string>;
  setSessionData(setSessionDto: SetSessionDto): Promise<void>;
  deleteSessionData(): Promise<void>;
}
