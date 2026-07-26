import Lesson from '../models/Lesson.js';
import { generateLessonPrompt } from '../services/geminiService.js';

export const getLessonById = async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id).populate({
            path: 'module',
            populate: { path: 'course' }
        });

        if (!lesson) return res.status(404).json({ message: "Lesson not found" });

        if (lesson.isEnriched) {
            return res.status(200).json(lesson);
        }

        const lessonTitle = lesson.title;
        const moduleTitle = lesson.module ? lesson.module.title : "Core Module";
        const courseTitle = lesson.module && lesson.module.course ? lesson.module.course.title : "Comprehensive Course";

        const aiContent = await generateLessonPrompt(courseTitle, moduleTitle, lessonTitle);

        lesson.objectives = aiContent.objectives || [];
        lesson.content = aiContent.content || [];
        lesson.isEnriched = true;

        await lesson.save();
        res.status(200).json(lesson);
    } catch (error) {
        console.error("Lesson Error:", error);
        res.status(500).json({ message: "Server error while processing lesson" });
    }
};