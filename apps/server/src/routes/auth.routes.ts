import express, { Router } from 'express';

const app = express();

export const authRouter: Router = Router();

authRouter.post('/signup', (req,res) => {

    res.json({
        message: "signup endpoint"
    })
})

authRouter.post('/signin', (req,res) => {

    res.json({
        message: "signin endpoint"
    })
})