import express, { Router } from "express";
import { prismaClient } from "@repo/db/client";
import upload from "../config/multer.js";

export const videoRouter: Router = express.Router();

videoRouter.post('/uploads', upload.single('video'), async (req, res)=>{
try{
    const {title, description, authorId, youtuberId} = req.body;
    //@ts-ignore
    const {path: filePath} = req.file;
    //@ts-ignore
    const { userId: userId } = req.userId;

    
    if(!req.file || !title){
        return res.status(400).json({message: 'Video file and title are required.'})
    }

    const newVideo = await prismaClient.video.create({
        data: {
          title,
          description: description || '',
          filePath,// The path where the video is saved (e.g., "uploads/1726242686161-video.mp4")
          status: 'PENDING',
          s3Key: req.file?.filename || "",
          authorId,
          youtuberId
          
      }});

      res.status(201).json(newVideo);

    }catch (error) {
      console.error("Upload Error:", error);
      res.status(500).json({ message: 'Server error during video upload.' });
    }
}) 

export default videoRouter;
