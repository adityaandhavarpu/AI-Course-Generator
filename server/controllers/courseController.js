import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';
import { generateCoursePrompt } from '../services/geminiService.js';

export const generateAndSaveCourse = async (req, res) => {
    try {
        const { topic } = req.body;
        const creatorId = req.user._id;

        if (!topic) return res.status(400).json({ message: "Topic is required" });

        const courseOutline = await generateCoursePrompt(topic);

        const newCourse = new Course({
            title: courseOutline.title,
            description: courseOutline.description,
            creator: creatorId,
            tags: courseOutline.tags || [topic],
            modules: []
        });
        const savedCourse = await newCourse.save();

        for (const modData of courseOutline.modules) {
            const newModule = new Module({
                title: modData.title,
                course: savedCourse._id,
                lessons: []
            });
            const savedModule = await newModule.save();

            for (const lesData of modData.lessons) {
                const newLesson = new Lesson({
                    title: lesData.title,
                    objectives: [],
                    content: [],
                    isEnriched: false,
                    module: savedModule._id
                });
                const savedLesson = await newLesson.save();
                savedModule.lessons.push(savedLesson._id);
                await savedModule.save();
            }

            savedCourse.modules.push(savedModule._id);
            await savedCourse.save();
        }

        const populatedCourse = await Course.findById(savedCourse._id).populate({
            path: 'modules',
            populate: { path: 'lessons' }
        });

        res.status(201).json(populatedCourse);
    } catch (error) {
        res.status(500).json({ message: "Failed to generate course outline via AI" });
    }
};

export const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({ creator: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching courses" });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('modules');
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: "Course not found" });

        if (course.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this course" });
        }

        const modules = await Module.find({ course: course._id });
        for (const mod of modules) {
            await Lesson.deleteMany({ module: mod._id });
        }

        await Module.deleteMany({ course: course._id });
        await course.deleteOne();

        res.status(200).json({ message: "Course and contents removed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error during deletion" });
    }
};