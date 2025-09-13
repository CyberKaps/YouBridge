import express, { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';


export const videoRouter: Router = Router();


videoRouter.get("/video", authMiddleware, (req, res) => {

    res.json({
        message: "this is authenticated endpoint"
    })
})