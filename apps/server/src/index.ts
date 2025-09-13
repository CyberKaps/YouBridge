dotenv.config();
import express from 'express'
import { authRouter } from './routes/auth.routes.js';
import { videoRouter } from './routes/test.routes.js';
import dotenv from 'dotenv';

const app = express()

app.use(express.json());



app.use("/api/vi", authRouter);
app.use("/api/vi", videoRouter);



app.listen(5000)