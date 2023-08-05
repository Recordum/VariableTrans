import { User } from '../entity/user.entity';

export interface SessionService {
  getSessionData(sessionId: string): string;
  setSessionData(sessionId: string, user: User): void;
  deleteSessionData(): void;
}
