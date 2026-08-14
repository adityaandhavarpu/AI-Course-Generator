import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI, moduleAPI, lessonAPI } from '../api/client';

const CourseView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getCourseById(id);
      setCourse(response.data);
      if (response.data.modules?.length > 0) {
        setSelectedModule(response.data.modules[0]);
        if (response.data.modules[0].lessons?.length > 0) {
          // Fetch enriched lesson for first lesson
          const lessonResponse = await lessonAPI.getLessonById(response.data.modules[0].lessons[0]._id);
          setSelectedLesson(lessonResponse.data);
        }
      }
    } catch (err) {
      setError('Failed to load course');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLesson = async (lesson) => {
    setLessonLoading(true);
    try {
      // Fetch enriched lesson from backend (lessonController will enrich if needed)
      const response = await lessonAPI.getLessonById(lesson._id);
      setSelectedLesson(response.data);
    } catch (err) {
      console.error('Error fetching lesson:', err);
      // Fallback to basic lesson data
      setSelectedLesson(lesson);
    } finally {
      setLessonLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Course not found'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="mb-4 text-white hover:text-gray-200 flex items-center gap-2"
          >
            ← Back to Courses
          </button>
          <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
          <p className="text-blue-100">{course.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Modules Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📚 Modules</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {course.modules?.map((module, idx) => (
                  <button
                    key={module._id}
                    onClick={() => {
                      setSelectedModule(module);
                      if (module.lessons?.length > 0) {
                        handleSelectLesson(module.lessons[0]);
                      }
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      selectedModule?._id === module._id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">{idx + 1}. {module.title}</div>
                    <div className="text-xs mt-1 opacity-75">
                      {module.lessons?.length || 0} lessons
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedModule ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                {/* Module Header */}
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {selectedModule.title}
                </h2>

                {/* Lessons List */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">📖 Lessons</h3>
                  <div className="space-y-2">
                    {selectedModule.lessons?.map((lesson, idx) => (
                      <button
                        key={lesson._id}
                        onClick={() => handleSelectLesson(lesson)}
                        disabled={lessonLoading}
                        className={`w-full text-left px-4 py-3 rounded-lg transition ${
                          selectedLesson?._id === lesson._id
                            ? 'bg-blue-100 border-l-4 border-blue-600'
                            : 'bg-gray-50 hover:bg-gray-100'
                        } disabled:opacity-50`}
                      >
                        <div className="font-medium text-gray-900">
                          {idx + 1}. {lesson.title}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lesson Content */}
                {lessonLoading ? (
                  <div className="text-center py-8">
                    <div className="inline-block">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="mt-2 text-gray-600">Loading lesson content...</p>
                  </div>
                ) : selectedLesson ? (
                  <div className="border-t pt-6">
                    <h4 className="text-2xl font-bold text-gray-900 mb-4">
                      {selectedLesson.title}
                    </h4>

                    {selectedLesson.objectives && selectedLesson.objectives.length > 0 && (
                      <div className="mb-6">
                        <h5 className="text-lg font-bold text-gray-800 mb-2">📋 Objectives</h5>
                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                          {selectedLesson.objectives.map((obj, idx) => (
                            <li key={idx}>{obj}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedLesson.content && selectedLesson.content.length > 0 ? (
                      <div className="mb-6">
                        <h5 className="text-lg font-bold text-gray-800 mb-2">📚 Content</h5>
                        <div className="bg-gray-50 p-4 rounded-lg text-gray-700 whitespace-pre-wrap">
                          {typeof selectedLesson.content === 'string'
                            ? selectedLesson.content
                            : selectedLesson.content.join('\n')}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
                        ℹ️ No content available yet for this lesson
                      </div>
                    )}

                    <div className="text-sm text-gray-500 mt-4">
                      {selectedLesson.isEnriched ? '✅ Enriched' : '⏳ Not enriched'}
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-600 text-lg">Select a module to view lessons</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseView;
