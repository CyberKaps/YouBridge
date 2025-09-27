import express, { Router } from "express";
import { prismaClient } from "@repo/db/client";
import upload from "../config/multer.js";
import { Request } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
  userId?: string;
  user?: { userId: string; role: string };
}

export const videoRouter: Router = express.Router();

videoRouter.post('/uploads',
    upload.single('videoFile'), 
    authMiddleware, 
    authorize(['EDITOR']), 
    async (req: MulterRequest, res) => {
    try {

        const { title, description, authorId, youtuberId } = req.body;
        const filePath = req.file?.path;
        const userId = req.userId;

        if (!req.file || !title) {
            return res.status(400).json({ message: 'Video file and title are required.' });
        }

        if (!req.user?.userId) {
            return res.status(400).json({ message: "userId is required"});
        }

        const newVideo = await prismaClient.video.create({
            data: {
                title,
                description: description || '',
                filePath: filePath || "",
                status: 'PENDING',
                s3Key: req.file.filename || "",
                authorId: req.user.userId,
                youtuberId
            }
        });

        res.status(201).json(newVideo);

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: 'Server error during video upload.' });
    }
});

export default videoRouter;
