import express from 'express'
import { authRouter } from './routes/auth.routes.js';

const app = express()

app.use(express.json());



app.use("/api/vi", authRouter);


app.listen(5000)