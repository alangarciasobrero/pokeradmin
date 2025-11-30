import { Session, SessionData } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId?: number;
    username?: string;
    role?: string;
    flash?: { type?: string; message?: string } | null;
  }
}
