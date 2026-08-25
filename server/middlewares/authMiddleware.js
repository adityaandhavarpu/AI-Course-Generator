import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import dotenv from 'dotenv';

dotenv.config();

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: { id: true, name: true, email: true }
            });

            if (!req.user) {
                return res.status(401).json({ message: "Not authorized, user no longer exists" });
            }

            return next();
        } catch (error) {
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token provided" });
    }
};