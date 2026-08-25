import prisma from '../config/prisma.js';
import { generateLessonPrompt } from '../services/geminiService.js';

export const getLessonById = async (req, res) => {
    try {
        const lesson = await prisma.lesson.findUnique({
            where: { id: req.params.id },
            include: {
                module: {
                    include: { course: { select: { title: true, creatorId: true } } }
                }
            }
        });

        if (!lesson) return res.status(404).json({ message: "Lesson not found" });

        if (lesson.module.course.creatorId !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to access this lesson" });
        }

        if (lesson.isEnriched) {
            const { module, ...responseData } = lesson;
            return res.status(200).json(responseData);
        }

        const lessonTitle = lesson.title;
        const moduleTitle = lesson.module ? lesson.module.title : "Core Module";
        const courseTitle = lesson.module && lesson.module.course ? lesson.module.course.title : "Comprehensive Course";

        const aiContent = await generateLessonPrompt(courseTitle, moduleTitle, lessonTitle);

        const updatedLesson = await prisma.lesson.update({
            where: { id: lesson.id },
            data: {
                objectives: aiContent.objectives || [],
                content: aiContent.content || [],
                isEnriched: true
            }
        });

        res.status(200).json(updatedLesson);
    } catch (error) {
        console.error("Lesson Error:", error);
        res.status(500).json({ message: "Server error while processing lesson" });
    }
};