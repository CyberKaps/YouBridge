import { google } from "googleapis";
import { prismaClient } from "@repo/db/client";
import fs from "fs";

export const uploadToYouTube = async (videoId: string, youtuberId: string) => {
    try {
        const video = await prismaClient.video.findUnique({
            where: { id: videoId }
        });

        if (!video) {
            throw new Error("Video not found");
        }

        const youtuber = await prismaClient.user.findUnique({
            where: { id: youtuberId }
        });

        if (!youtuber || !youtuber.accessToken) {
            throw new Error("YouTuber not found or not authenticated with Google");
        }

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            "http://localhost:4000/api/v1/google/callback"
        );

        oauth2Client.setCredentials({
            access_token: youtuber.accessToken,
            refresh_token: youtuber.refreshToken
        });

        const youtube = google.youtube({
            version: 'v3',
            auth: oauth2Client
        });

        const fileSize = fs.statSync(video.filePath).size;
        
        console.log(`Starting upload to YouTube for video ${videoId}...`);
        
        const res = await youtube.videos.insert(
            {
                part: ['snippet', 'status'],
                requestBody: {
                    snippet: {
                        title: video.title,
                        description: video.description || "",
                    },
                    status: {
                        privacyStatus: 'private', // Upload as private by default
                        selfDeclaredMadeForKids: false
                    }
                },
                media: {
                    body: fs.createReadStream(video.filePath)
                }
            },
            {
                onUploadProgress: evt => {
                    if (evt.bytesRead) {
                        const progress = (evt.bytesRead / fileSize) * 100;
                        console.log(`YouTube Upload Progress: ${Math.round(progress)}%`);
                    }
                }
            }
        );

        console.log("Upload completed. YouTube Video ID:", res.data.id);

        // Update video status
        await prismaClient.video.update({
            where: { id: video.id },
            data: { status: 'PUBLISHED' }
        });

        return res.data;

    } catch (error) {
        console.error("YouTube Upload Error:", error);
        throw error;
    }
};
