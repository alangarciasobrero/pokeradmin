import { Request, Response, NextFunction } from 'express';
import sequelize from '../services/database';

// lazy import to avoid circular dependencies at module load
async function findAnyAdminUserId(): Promise<number | null> {
    try {
        const { User } = await import('../models/User');
        const u = await (User as any).findOne({ where: { role: 'admin' } });
        if (u) return (u as any).id;
        return null;
    } catch (e) {
        return null;
    }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    // If session-based authentication is used, expect req.session.userId to be set
    // This mirrors the previous inline middleware behavior in app.ts
    // Redirect to /login for unauthenticated users
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const s: any = (req as any).session;
    if (!s || !s.userId) {
        return res.redirect('/login');
    }
    next();
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const s: any = (req as any).session;
    if (!s || !s.userId || s.role !== 'admin') {
        if (process.env.NODE_ENV === 'development') {
            // try to find any admin user in DB and set session to that user for dev convenience
            const aid = await findAnyAdminUserId();
            if (aid && req.session) {
                (req.session as any).userId = aid;
                (req.session as any).role = 'admin';
                (req.session as any).username = (req.session as any).username || 'dev-admin';
            }
        }
    }
    // re-check
    if (!s || !s.userId || s.role !== 'admin') {
        return res.status(403).send('Acceso denegado');
    }
    next();
}
