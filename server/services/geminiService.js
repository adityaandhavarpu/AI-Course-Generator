import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateCoursePrompt = async (topic) => {
  try {
    const prompt = `
      You are an expert curriculum designer. Create a comprehensive course outline for the topic: "${topic}".
      Progress from foundational to advanced concepts, ensuring comprehensive coverage of essential subtopics.
      You MUST respond with a raw JSON object and absolutely no Markdown formatting or additional explanatory text.
      The JSON must follow this exact structure:
      {
        "title": "Course Title",
        "description": "A short description of the course",
        "tags": ["tag1", "tag2"],
        "modules": [
          {
            "title": "Module Title",
            "lessons": [
              { "title": "Lesson Title" }
            ]
          }
        ]
      }
      Ensure there are at least 3 modules, and each module has at least 2 lessons.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Course Outline Generation Error:", error);
    throw new Error("Failed to generate course outline");
  }
};

export const generateLessonPrompt = async (courseTitle, moduleTitle, lessonTitle) => {
  try {
    const prompt = `
      You are an expert technical writer and educator. Write detailed content for the lesson titled "${lessonTitle}" under the module "${moduleTitle}" for the course "${courseTitle}".
      You MUST respond with a raw JSON object and absolutely no Markdown formatting or additional text.
      The JSON must follow this exact structure:
      {
        "title": "${lessonTitle}",
        "objectives": ["Understand concept X", "Identify pattern Y"],
        "content": [
          { "type": "heading", "text": "Section heading text" },
          { "type": "paragraph", "text": "Detailed multi-sentence explanation..." },
          { "type": "code", "language": "javascript", "text": "// Code snippet if relevant to the lesson" },
          { "type": "video", "query": "search query for a relevant YouTube tutorial video" },
          { 
            "type": "mcq", 
            "question": "Sample question text testing this lesson?", 
            "options": ["Option A", "Option B", "Option C", "Option D"], 
            "correctAnswer": "Option A", 
            "explanation": "Detailed explanation of why this answer is correct." 
          }
        ]
      }
      Include rich explanatory blocks, a code block when relevant, a video search query, and 4 to 5 multiple-choice questions (MCQs) at the end with explanations.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error(`Lesson Content Generation Error for ${lessonTitle}:`, error);
    throw new Error(`Failed to generate content for lesson: ${lessonTitle}`);
  }
};

