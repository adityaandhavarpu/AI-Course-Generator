import prisma from '../config/prisma.js';

export const getModuleById = async (req, res) => {
    try {
        const moduleDoc = await prisma.module.findUnique({
            where: { id: req.params.id },
            include: { 
                lessons: { orderBy: { order: 'asc' } },
                course: { select: { creatorId: true } }
            }
        });
        
        if (!moduleDoc) return res.status(404).json({ message: "Module not found" });

        if (moduleDoc.course.creatorId !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to access this module" });
        }

        const { course, ...responseData } = moduleDoc;
        res.status(200).json(responseData);
    } catch (error) {
        console.error("Module Fetch Error:", error);
        res.status(500).json({ message: "Server error while fetching module" });
    }
};