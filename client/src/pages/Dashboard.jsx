import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

const SUGGESTED_TOPICS = [
  { label: '⚡ React 19 & Server Actions', topic: 'React 19 Server Components and Actions' },
  { label: '🤖 Distributed Systems Design', topic: 'Distributed Systems & Queue Architecture' },
  { label: '🐳 Docker Microservices', topic: 'Containerization & Microservices with Docker' },
  { label: '🐍 Python for Machine Learning', topic: 'Python Machine Learning & Data Pipelines' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [topic, setTopic] = useState('');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getCourses();
      setCourses(response.data);
    } catch (err) {
      setError('Failed to load courses');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCourse = async (e, customTopic) => {
    if (e) e.preventDefault();
    const targetTopic = customTopic || topic;
    if (!targetTopic.trim()) return;

    setGenerating(true);
    setError('');
    try {
      const response = await courseAPI.generateCourse(targetTopic.trim());
      setTopic('');
      await fetchCourses();
      navigate(`/courses/${response.data.courseId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate course');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteCourse = async (courseId, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    try {
      await courseAPI.deleteCourse(courseId);
      setCourses((currentCourses) => currentCourses.filter((course) => course.id !== courseId));
    } catch (err) {
      setError('Failed to delete course');
    }
  };

  return (
    <div className="min-h-screen bg-[#131314] text-[#e3e3e3] flex overflow-hidden">
      {/* Left Sidebar (Gemini Style Course History) */}
      <aside
        className={`${
          sidebarOpen ? 'w-72' : 'w-0 sm:w-16'
        } transition-all duration-300 bg-[#1e1f20] border-r border-[#2d2f31] flex flex-col justify-between z-30 shrink-0 relative`}
      >
        <div className="p-3 space-y-4">
          {/* Top Bar inside Sidebar */}
          <div className="flex items-center justify-between px-2 py-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-[#28292a] text-[#c4c7c5] hover:text-white transition"
              title="Toggle Sidebar"
            >
              ☰
            </button>
            {sidebarOpen && (
              <span className="text-xs font-bold text-[#4285f4] uppercase tracking-wider">
                Workspace
              </span>
            )}
          </div>



          {/* Recent Courses List */}
          {sidebarOpen && (
            <div className="space-y-3 pt-2">
              <h4 className="text-[11px] font-bold text-[#80868b] uppercase tracking-wider px-2">
                Recent Courses ({courses.length})
              </h4>

              <div className="space-y-1 max-h-[calc(100vh-230px)] overflow-y-auto pr-1">
                {loading ? (
                  <div className="space-y-2 p-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-8 rounded-lg bg-[#28292a] animate-pulse" />
                    ))}
                  </div>
                ) : courses.length === 0 ? (
                  <p className="text-xs text-[#80868b] px-2 py-4 text-center">No courses yet</p>
                ) : (
                  courses.map((course) => (
                    <div
                      key={course.id}
                      onClick={() => navigate(`/courses/${course.id}`)}
                      className="group flex items-center justify-between p-2 rounded-xl hover:bg-[#28292a] border border-transparent hover:border-[#2d2f31] cursor-pointer transition text-xs text-[#c4c7c5] hover:text-white"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-sm shrink-0">📖</span>
                        <span className="truncate font-medium">{course.title}</span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteCourse(course.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition rounded"
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Footer inside Sidebar */}
        {sidebarOpen && (
          <div className="p-3 border-t border-[#2d2f31] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-xs font-medium text-[#c4c7c5] truncate max-w-[110px]">
                {user?.name || 'User'}
              </span>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="text-[11px] text-[#80868b] hover:text-white transition"
            >
              Logout
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Navbar */}
        <header className="border-b border-[#2d2f31] glass-panel sticky top-0 z-20 px-6 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4285f4] via-[#9b51e0] to-[#e91e63] flex items-center justify-center p-0.5">
              <div className="w-full h-full bg-[#131314] rounded-[10px] flex items-center justify-center">
                <span className="text-sm animate-spark-pulse">✨</span>
              </div>
            </div>
            <h1 className="text-lg font-extrabold tracking-tight">
              AI <span className="gemini-text-gradient">Course Generator</span>
            </h1>
          </div>
        </header>



        {/* Main Workspace */}
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col justify-between gap-8">
          {/* Hero Section & Prompt Input */}
          <section className="flex flex-col items-center text-center gap-6 pt-6">
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight max-w-2xl leading-tight">
              Hello, <span className="gemini-text-gradient">{user?.name || 'Learner'}</span>. <br />
              What do you want to learn today?
            </h2>

            {/* Prompt Center Box */}
            <div className="w-full max-w-2xl mt-2">
              <form
                onSubmit={handleGenerateCourse}
                className="relative group rounded-2xl glass-card border border-[#2d2f31] focus-within:border-[#4285f4] transition shadow-2xl p-3 flex flex-col gap-3"
              >
                <div className="flex items-start gap-3 px-2 pt-1">
                  <span className="text-2xl mt-1 text-[#4285f4]">✨</span>
                  <textarea
                    rows={2}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter any topic or concept (e.g. Master System Design, React 19, Microservices)..."
                    className="w-full bg-transparent text-[#e3e3e3] placeholder-[#80868b] focus:outline-none resize-none text-base font-normal leading-relaxed"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleGenerateCourse(e);
                      }
                    }}
                  />
                </div>

                <div className="flex justify-end items-center pt-2 border-t border-[#2d2f31]/50 px-2">
                  <button
                    type="submit"
                    disabled={generating || !topic.trim()}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4285f4] via-[#9b51e0] to-[#e91e63] text-white font-semibold text-sm hover:opacity-95 transition flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
                  >

                    {generating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Generating AI Course...</span>
                      </>
                    ) : (
                      <>
                        <span>Generate Course</span>
                        <span>✨</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Quick Suggestion Chips */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {SUGGESTED_TOPICS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTopic(item.topic);
                      handleGenerateCourse(null, item.topic);
                    }}
                    disabled={generating}
                    className="px-3.5 py-1.5 rounded-full bg-[#1e1f20] hover:bg-[#28292a] border border-[#2d2f31] text-xs text-[#c4c7c5] hover:text-white transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Error Notification */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex justify-between items-center">
              <span>⚠️ {error}</span>
              <button onClick={() => setError('')} className="text-xs text-red-400 underline">Dismiss</button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default Dashboard;



