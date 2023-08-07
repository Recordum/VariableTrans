import { User } from '../entity/user.entity';

export interface SessionService {
  getSessionData(sessionId: string): Promise<string>;
  setSessionData(sessionId: string, user: User): Promise<void>;
  deleteSessionData(): Promise<void>;
}
