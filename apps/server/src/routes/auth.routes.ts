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

        const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data.email,
                password: hashedPassword,
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

    const user = await prismaClient.user.findFirst({
        where: {
            email: parsedData.data.email
        }
    })

    if(!user) {
        res.status(403).json({
            error: "Not authorized"
        });
        return;
    }

    const isPasswordValid = await bcrypt.compare(parsedData.data.password, user.password);

    if (!isPasswordValid) {
        return res.status(403).json({
            error: "Not authorized"
        });
    }
    
    const token = jwt.sign({
        userId: user.id,
    }, "kalpesh");

    res.json({
        token
    })


})