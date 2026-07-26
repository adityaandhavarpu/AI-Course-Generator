import Module from '../models/Module.js';

export const getModuleById = async (req, res) => {
    try {
        const moduleDoc = await Module.findById(req.params.id).populate('lessons');
        if (!moduleDoc) return res.status(404).json({ message: "Module not found" });
        res.status(200).json(moduleDoc);
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching module" });
    }
};