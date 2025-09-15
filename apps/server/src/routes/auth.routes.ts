import express, { Router } from 'express';
import { SigninSchema, SignupSchema } from '@repo/common/types';
import { prismaClient } from '@repo/db/client';
import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import dotenv from 'dotenv';
dotenv.config();

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

        const existing = await prismaClient.user.findUnique({
            where: { email: parsedData.data.email }
        });
        if (existing) {
            return res.status(409).json({ error: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(parsedData.data.password, 10);

        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data.email,
                password: hashedPassword,
                role: parsedData.data.role
            }
        })


        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            user: { id: user.id, email: user.email, role: user.role }
        })

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({
            error: "Internal server error"
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

    const isPasswordValid = await bcrypt.compare(parsedData.data.password, user.password as string);

    if (!isPasswordValid) {
        return res.status(403).json({
            error: "Not authorized"
        });
    }
    
    const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
    );

    res.json({
        token,
        user: { id: user.id, email: user.email, role: user.role }
    })


})



// Oauth2.0 routes

console.log("CLIENT_ID from .env:", process.env.GOOGLE_CLIENT_ID);

const oauth2Client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: "http://localhost:4000/api/v1/google/callback"
});

// Google callback
authRouter.get("/google", (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: "offline", //ensure refresh token
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
            "https://www.googleapis.com/auth/youtube.upload"
        ]
    });
    res.redirect(url);
});

// google callback
authRouter.get("/google/callback", async (req, res) => {
    
    try {
        const code = req.query.code as string;

        if (!code) {
            return res.status(400).json({ error: "Authorization code missing" });
        }

        const {tokens} = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        //get user profile info
        const userInfoResponse = await fetch(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            {
                headers: {Authorization: `Bearer ${tokens.access_token}`},
            }
        );

        if (!userInfoResponse.ok) {
            throw new Error("Failed to fetch Google profile");
        }
        
        const profile = await userInfoResponse.json();

        //find or create user
        let user = await prismaClient.user.findUnique({
            where: { email: profile.email}
        });

        if(!user) {
            user = await prismaClient.user.create({
                data: {
                email: profile.email,
                role: "YOUTUBER",
                googleId: profile.id,
                accessToken: tokens.access_token!,
                refreshToken: tokens.refresh_token ?? null,
        },
        });
        } else {
            // Update tokens on login
            user = await prismaClient.user.update({
            where: { id: user.id },
                data: {
                    accessToken: tokens.access_token!,
                    refreshToken: tokens.refresh_token ?? user.refreshToken,
                },
            });
    
        }

        // Generate your app’s JWT
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "7d" }
        );

        // For frontend: redirect with token
        res.json({ token });
    } catch (error: any) {
        console.error("Google OAuth Error:", error);
        res.status(500).json({
            error: "Google authentication failed",
            details: error.message,
        });
    }
})