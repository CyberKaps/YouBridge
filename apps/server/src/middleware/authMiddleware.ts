

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'


export function middleware(req:Request, res:Response, next:NextFunction) {

    const token = req.headers['authorization'];

    // if(!authHeader) {
    //     res.status(401).json({
    //         error: "Authorization header missing"
    //     })
    // }

    // const token = authHeader?.split(" ")[1];

    // if(!token) {
    //     res.status(401).json({
    //         error: "Token missing"
    //     })
    // }


    try {
        
        const decoded = jwt.verify(token as string, "kalpesh");

        //@ts-ignore
        req.userId = decoded.userId;
        next();

    } catch {
        res.status(401).json({
            error: "Unauthorized"
        })
    }
}