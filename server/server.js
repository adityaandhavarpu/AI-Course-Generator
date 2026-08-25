import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './config/prisma.js';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import moduleRoutes from './routes/moduleRoutes.js';
import lessonRoutes from './routes/lessonRoutes.js';

dotenv.config();


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/lessons', lessonRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ message: "AI Course Generator API is running successfully" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));

process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});