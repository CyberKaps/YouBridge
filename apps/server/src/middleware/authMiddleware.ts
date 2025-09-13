

import { Request, Response, NextFunction } from 'express';
import jwt, {JwtPayload} from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

export interface AuthRequest extends Request {
  user?: { userId: string; role: string };
}


export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {

    const authHeader = req.headers['authorization'];

    if(!authHeader) {
        return res.status(401).json({
            error: "Authorization header missing"
        })
    }

    const token = authHeader?.split(" ")[1];

    if(!token) {
        res.status(401).json({
            error: "Token missing"
        })
    }


    try {
        
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET as string) as JwtPayload;

        req.user = {
            userId: decoded.userId,
            role: decoded.role
        }

        return next();

    } catch (err) {
        console.error("JWT verification failed:", err);
        return res.status(401).json({
            error: "Unauthorized or token expired"
        })
    }
}