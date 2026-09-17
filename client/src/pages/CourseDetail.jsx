import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI } from '../api/client';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchCourse();
    fetchAllCourses();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getCourseById(id);
      setCourse(response.data);
    } catch (err) {
      setError('Failed to load course');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCourses = async () => {
    try {
      const res = await courseAPI.getCourses();
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131314] text-[#e3e3e3] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-3 border-[#4285f4] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-[#80868b] font-medium">Loading Course Outline...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-[#131314] text-[#e3e3e3] flex items-center justify-center p-4">
        <div className="text-center p-8 rounded-2xl glass-card border border-[#2d2f31] max-w-md">
          <p className="text-red-400 mb-6 font-medium">{error || 'Course not found'}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#4285f4] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition"
          >
            ← Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131314] text-[#e3e3e3] flex overflow-hidden">
      {/* Left Sidebar (Course List Navigation) */}
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

          {/* Back to Home Button */}
          <button
            onClick={() => navigate('/')}
            className="w-full py-2 px-3 rounded-xl bg-[#28292a] hover:bg-[#333537] border border-[#2d2f31] text-xs font-semibold text-[#c4c7c5] hover:text-white flex items-center gap-2 transition"
          >
            <span>←</span>
            {sidebarOpen && <span>Back to Home</span>}
          </button>

          {/* Recent Courses List */}
          {sidebarOpen && (
            <div className="space-y-3 pt-2">
              <h4 className="text-[11px] font-bold text-[#80868b] uppercase tracking-wider px-2">
                All Courses ({courses.length})
              </h4>

              <div className="space-y-1 max-h-[calc(100vh-230px)] overflow-y-auto pr-1">
                {courses.map((item) => {
                  const isCurrent = item.id === course.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => navigate(`/courses/${item.id}`)}
                      className={`p-2 rounded-xl border cursor-pointer transition text-xs flex items-center gap-2 ${
                        isCurrent
                          ? 'bg-[#28292a] border-[#4285f4] text-[#4285f4] font-bold'
                          : 'bg-transparent border-transparent text-[#c4c7c5] hover:bg-[#28292a] hover:text-white'
                      }`}
                    >
                      <span className="text-sm shrink-0">📖</span>
                      <span className="truncate font-medium">{item.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Navbar */}
        <header className="border-b border-[#2d2f31] glass-panel sticky top-0 z-20 px-6 py-3.5 flex items-center gap-3">
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

        {/* Main Workspace Container */}
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
          {/* Course Banner */}
          <div className="p-6 sm:p-8 rounded-2xl glass-card border border-[#2d2f31] space-y-3">
            <span className="px-2.5 py-1 rounded-md bg-[#28292a] text-[10px] font-semibold text-[#4285f4] uppercase tracking-wider border border-[#2d2f31]">
              Course Syllabus
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#e3e3e3] leading-tight">
              {course.title}
            </h2>
            <p className="text-sm text-[#c4c7c5] leading-relaxed max-w-3xl">
              {course.description || 'AI Generated Course Syllabus'}
            </p>
          </div>

          {/* Modules List */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#80868b] uppercase tracking-wider flex items-center gap-2">
              <span>📚</span> Modules ({course.modules?.length || 0})
            </h3>

            {course.modules && course.modules.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.modules.map((module, idx) => (
                  <div
                    key={module.id}
                    onClick={() => navigate(`/modules/${module.id}`)}
                    className="rounded-2xl glass-card hover:bg-[#28292a] border border-[#2d2f31] hover:border-[#4285f4]/40 p-5 transition cursor-pointer flex flex-col justify-between gap-4 group shadow-lg"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-[#9b51e0] uppercase tracking-wider">
                        Module {idx + 1}
                      </span>
                      <h4 className="text-base font-bold text-[#e3e3e3] group-hover:text-[#4285f4] transition line-clamp-2">
                        {module.title}
                      </h4>
                    </div>

                    <div className="pt-3 border-t border-[#2d2f31]/60 flex items-center justify-between text-xs text-[#4285f4] font-semibold group-hover:translate-x-1 transition-transform">
                      <span>View Lessons</span>
                      <span>➔</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 rounded-2xl glass-card border border-[#2d2f31] text-sm text-[#80868b]">
                No modules found for this course.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseDetail;
