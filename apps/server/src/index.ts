
import express from 'express'
import { authRouter } from './routes/auth.routes.js';
import { videoRouter } from './routes/video.routes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express()

app.use(express.json());



app.use("/api/v1", authRouter);
app.use("/api/v1", videoRouter);



app.listen(4000)