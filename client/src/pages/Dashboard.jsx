import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

const Dashboard = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  // Fetch courses on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (err) {
      setError('Failed to load courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCourse = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setGenerating(true);
    try {
      const response = await api.post('/courses/generate', { topic });
      setCourses([response.data, ...courses]);
      setTopic('');
      setShowGenerateModal(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate course');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      await api.delete(`/courses/${courseId}`);
      setCourses(courses.filter(c => c._id !== courseId));
    } catch (err) {
      setError('Failed to delete course');
    }
  };

  const getStoredUser = () => {
    try {
      const stored = localStorage.getItem('user');
      if (!stored || stored === 'undefined' || stored === 'null') return {};
      return JSON.parse(stored);
    } catch (err) {
      return {};
    }
  };

  const user = getStoredUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎓</span>
              <h1 className="text-3xl font-bold">AI Course Generator</h1>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
              }}
              className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </div>
          <p className="text-blue-100 mt-2">Welcome, {user.name || 'User'}! Generate AI-powered courses instantly.</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Generate Course Section */}
        <div className="mb-12">
          <button
            onClick={() => setShowGenerateModal(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition transform hover:scale-105"
          >
            ✨ Generate New Course
          </button>
        </div>

        {/* Generate Course Modal */}
        {showGenerateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Generate New Course</h2>
              <form onSubmit={handleGenerateCourse} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Course Topic</label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Advanced React Patterns"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter any topic and AI will create a structured course</p>
                </div>
                <div className="flex gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowGenerateModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={generating || !topic.trim()}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-2 rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {generating ? 'Generating...' : 'Generate'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Courses Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Courses</h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
              <p className="mt-4 text-gray-600">Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-2xl text-gray-600 mb-4">📚 No courses yet</p>
              <p className="text-gray-500">Generate your first course to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <div
                  key={course._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden cursor-pointer group"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-32 flex items-center justify-center group-hover:shadow-lg transition">
                    <span className="text-5xl">📖</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">
                        📚 {course.modules?.length || 0} modules
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/courses/${course._id}`)}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                      >
                        View Course
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCourse(course._id);
                        }}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
