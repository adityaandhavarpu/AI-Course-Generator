import prisma from '../config/prisma.js';
import { generateCoursePrompt } from '../services/geminiService.js';

export const generateAndSaveCourse = async (req, res) => {
    try {
        const { topic } = req.body;
        const creatorId = req.user.id;

        if (!topic) return res.status(400).json({ message: "Topic is required" });

        const courseOutline = await generateCoursePrompt(topic);

        const savedCourse = await prisma.course.create({
            data: {
                title: courseOutline.title,
                description: courseOutline.description,
                creatorId: creatorId,
            }
        });

        for (let i = 0; i < courseOutline.modules.length; i++) {
            const modData = courseOutline.modules[i];
            
            const savedModule = await prisma.module.create({
                data: {
                    title: modData.title,
                    order: i,
                    courseId: savedCourse.id
                }
            });

            for (let j = 0; j < modData.lessons.length; j++) {
                const lesData = modData.lessons[j];
                
                await prisma.lesson.create({
                    data: {
                        title: lesData.title,
                        order: j,
                        moduleId: savedModule.id
                    }
                });
            }
        }

        res.status(201).json({ 
            message: "Course generated successfully",
            courseId: savedCourse.id 
        });
    } catch (error) {
        console.error("Generate Course Error:", error);
        res.status(500).json({ message: "Failed to generate course outline via AI" });
    }
};

export const getCourses = async (req, res) => {
    try {
        const courses = await prisma.course.findMany({
            where: { creatorId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching courses" });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const course = await prisma.course.findUnique({
            where: { id: req.params.id },
            include: { 
                modules: {
                    orderBy: { order: 'asc' }
                } 
            }
        });
        
        if (!course) return res.status(404).json({ message: "Course not found" });

        if (course.creatorId !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to access this course" });
        }

        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const course = await prisma.course.findUnique({ where: { id: req.params.id } });
        
        if (!course) return res.status(404).json({ message: "Course not found" });

        if (course.creatorId !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this course" });
        }

        await prisma.course.delete({ where: { id: req.params.id } });

        res.status(200).json({ message: "Course and contents removed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error during deletion" });
    }
};