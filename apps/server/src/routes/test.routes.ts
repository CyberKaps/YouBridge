import express, { Router } from 'express';
import { middleware } from '../middleware/authMiddleware.js';


export const videoRouter: Router = Router();


videoRouter.get("/video", middleware, (req, res) => {

    res.json({
        message: "this is authenticated endpoint"
    })
})