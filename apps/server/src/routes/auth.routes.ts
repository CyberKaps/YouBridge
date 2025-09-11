import express, { Router } from 'express';
import { SigninSchema, SignupSchema } from '@repo/common/types';
import { prismaClient } from '@repo/db/client';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

const app = express();

export const authRouter: Router = Router();

authRouter.post('/signup', async (req,res) => {
    
    const parsedData = SignupSchema.safeParse(req.body);
    if(!parsedData.success) {
        res.status(400).json({
            error: "Invalid data"
        });
        return;
    }

    try {
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data.email,
                //TODO: hash the password before storing it
                password: parsedData.data.password,
                role: parsedData.data.role
            }
        })

        res.json({
            userId: user.id,
        })

    } catch (error) {
        res.status(411).json({
            error: "User already exists"
        });
    }
})

authRouter.post('/signin', async (req,res) => {

    const parsedData = SigninSchema.safeParse(req.body);

    if(!parsedData.success) {
        res.status(400).json({
            error: "Invalid data"
        });
        return;
    }

    // TODO: compare the hashed password here
    const user = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data.email,
            password: parsedData.data.password
        }
    })

    if(!user) {
        res.status(403).json({
            error: "Not authorized"
        });
        return;
    }
    
    const token = jwt.sign({
        userId: user.id,
    }, "kalpesh");

    res.json({
        token
    })


})