
import express from 'express'
import cors from 'cors';
import { authRouter } from './routes/auth.routes.js';
import { videoRouter } from './routes/video.routes.js';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

const app = express()

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use("/api/v1", authRouter);
app.use("/api/v1", videoRouter);



app.listen(4000)