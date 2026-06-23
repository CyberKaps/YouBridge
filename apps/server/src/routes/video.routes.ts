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

import { uploadToYouTube } from "../services/youtube.service.js";

// GET /youtuber
videoRouter.get('/youtuber', authMiddleware, authorize(['YOUTUBER']), async (req: MulterRequest, res) => {
    try {
        const videos = await prismaClient.video.findMany({
            where: { youtuberId: req.user?.userId },
            include: { author: { select: { email: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(videos);
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /editor
videoRouter.get('/editor', authMiddleware, authorize(['EDITOR']), async (req: MulterRequest, res) => {
    try {
        const videos = await prismaClient.video.findMany({
            where: { authorId: req.user?.userId },
            include: { youtuber: { select: { email: true } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(videos);
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /:id/approve
videoRouter.put('/:id/approve', authMiddleware, authorize(['YOUTUBER']), async (req: MulterRequest, res) => {
    try {
        const videoId = req.params.id;
        const youtuberId = req.user?.userId;

        if (!youtuberId) {
            return res.status(400).json({ message: "userId is required"});
        }

        const video = await prismaClient.video.findUnique({ where: { id: videoId } });
        
        if (!video || video.youtuberId !== youtuberId) {
            return res.status(404).json({ message: "Video not found or unauthorized" });
        }

        if (video.status !== 'PENDING') {
            return res.status(400).json({ message: "Video is not in PENDING state" });
        }

        await prismaClient.video.update({
            where: { id: videoId },
            data: { status: 'APPROVED' }
        });

        // Trigger YouTube Upload in background
        const safeVideoId: string = videoId as string;
        const safeYoutuberId: string = youtuberId as string;
        uploadToYouTube(safeVideoId, safeYoutuberId).catch(err => {
            console.error("Background YouTube upload failed", err);
        });

        res.json({ message: "Video approved. Uploading to YouTube..." });

    } catch (error) {
        console.error("Approve Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /:id/reject
videoRouter.put('/:id/reject', authMiddleware, authorize(['YOUTUBER']), async (req: MulterRequest, res) => {
    try {
        const videoId = req.params.id;
        const youtuberId = req.user?.userId;

        if (!youtuberId) {
            return res.status(400).json({ message: "userId is required"});
        }

        const video = await prismaClient.video.findUnique({ where: { id: videoId } });
        
        if (!video || video.youtuberId !== youtuberId) {
            return res.status(404).json({ message: "Video not found or unauthorized" });
        }

        if (video.status !== 'PENDING') {
            return res.status(400).json({ message: "Video is not in PENDING state" });
        }

        await prismaClient.video.update({
            where: { id: videoId },
            data: { status: 'REJECTED' }
        });

        res.json({ message: "Video rejected." });

    } catch (error) {
        console.error("Reject Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default videoRouter;
