import { Request, Response, NextFunction } from 'express';

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

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const s: any = (req as any).session;
    if (!s || !s.userId || s.role !== 'admin') {
        return res.status(403).send('Acceso denegado');
    }
    next();
}
