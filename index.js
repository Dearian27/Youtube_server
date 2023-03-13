import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoute from './routes/users.js';
import commentRoute from './routes/comments.js';
import videoRoute from './routes/videos.js';
import authRoute from './routes/auth.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
app.use(cors());
dotenv.config();

const connect = () => {
  mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB');
  }).catch((err) => {
    throw err;
  })
}
mongoose.set('strictQuery', true);
app.use(cookieParser());
app.use(express.json());

app.use('/api/users', userRoute);
app.use('/api/comments', commentRoute);
app.use('/api/videos', videoRoute);
app.use('/api/auth', authRoute);

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  return res.status(status).json({
    success: false,
    status,
    message,
  })
})

app.listen(process.env.PORT, () => {
  connect();
  console.log(`Server is running on port ${process.env.PORT}`);
})
