import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { courseAPI, moduleAPI, lessonAPI } from '../api/client';
import LessonRenderer from '../components/LessonRenderer';

const CourseView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [expandedModules, setExpandedModules] = useState({});
  const [loading, setLoading] = useState(true);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await courseAPI.getCourseById(id);
      setCourse(response.data);
      
      // Auto-expand first module and select first lesson
      if (response.data.modules?.length > 0) {
        const firstMod = response.data.modules[0];
        setExpandedModules({ [firstMod.id]: true });
        await handleSelectModule(firstMod);
      }
    } catch (err) {
      setError('Failed to load course');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectModule = async (moduleSummary) => {
    try {
      setLessonLoading(true);
      setSelectedLesson(null);
      const response = await moduleAPI.getModuleById(moduleSummary.id);
      setSelectedModule(response.data);
      
      // Auto select first lesson of module
      if (response.data.lessons?.length > 0) {
        await handleSelectLesson(response.data.lessons[0]);
      }
    } catch (err) {
      setError('Failed to load module lessons');
    } finally {
      setLessonLoading(false);
    }
  };

  const handleSelectLesson = async (lesson) => {
    setLessonLoading(true);
    try {
      const response = await lessonAPI.getLessonById(lesson.id);
      setSelectedLesson(response.data);
    } catch (err) {
      console.error('Error fetching lesson:', err);
      setSelectedLesson(lesson);
    } finally {
      setLessonLoading(false);
    }
  };

  const toggleModuleExpand = (moduleId, e) => {
    if (e) e.stopPropagation();
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131314] text-[#e3e3e3] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-3 border-[#4285f4] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-[#80868b] font-medium">Loading Course Workspace...</p>
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
      {/* Left Tree-Navigation Sidebar (Course Modules & Lessons) */}
      <aside
        className={`${
          sidebarOpen ? 'w-80' : 'w-0 sm:w-14'
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
                Syllabus Navigation
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

          {/* Course Title Header */}
          {sidebarOpen && (
            <div className="px-2 pt-1 border-b border-[#2d2f31] pb-3">
              <span className="text-[10px] font-bold text-[#4285f4] uppercase tracking-wider">Course</span>
              <h3 className="text-sm font-extrabold text-[#e3e3e3] line-clamp-2 mt-0.5">
                {course.title}
              </h3>
            </div>
          )}

          {/* Modules & Lessons Tree */}
          {sidebarOpen && (
            <div className="space-y-2 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
              {course.modules?.map((mod, modIdx) => {
                const isModExpanded = expandedModules[mod.id];
                const isCurrentMod = selectedModule?.id === mod.id;

                return (
                  <div key={mod.id} className="rounded-xl overflow-hidden border border-[#2d2f31]/60">
                    {/* Module Header Pill */}
                    <button
                      onClick={(e) => {
                        toggleModuleExpand(mod.id, e);
                        if (!isCurrentMod) handleSelectModule(mod);
                      }}
                      className={`w-full text-left p-2.5 flex items-center justify-between text-xs transition ${
                        isCurrentMod ? 'bg-[#28292a] text-[#4285f4] font-bold' : 'bg-[#1e1f20] text-[#c4c7c5] hover:bg-[#28292a]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="text-[10px] text-[#80868b]">{modIdx + 1}.</span>
                        <span className="truncate">{mod.title}</span>
                      </div>
                      <span className="text-[10px] text-[#80868b]">{isModExpanded ? '▼' : '▶'}</span>
                    </button>

                    {/* Lessons Sub-Tree */}
                    {isModExpanded && (
                      <div className="bg-[#131314]/80 p-1.5 space-y-1 border-t border-[#2d2f31]/40">
                        {selectedModule?.id === mod.id && selectedModule.lessons?.length > 0 ? (
                          selectedModule.lessons.map((les, lesIdx) => {
                            const isLesSelected = selectedLesson?.id === les.id;
                            return (
                              <button
                                key={les.id}
                                onClick={() => handleSelectLesson(les)}
                                className={`w-full text-left py-1.5 px-3 rounded-lg text-xs transition flex items-center gap-2 ${
                                  isLesSelected
                                    ? 'bg-[#4285f4]/20 border border-[#4285f4]/50 text-white font-semibold'
                                    : 'text-[#80868b] hover:text-[#e3e3e3] hover:bg-[#28292a]'
                                }`}
                              >
                                <span className="text-[10px] text-[#4285f4]">•</span>
                                <span className="truncate">{lesIdx + 1}. {les.title}</span>
                              </button>
                            );
                          })
                        ) : (
                          <div className="py-1 px-3 text-[11px] text-[#80868b] animate-pulse">
                            Click module to load lessons...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        {/* Top Navbar */}
        <header className="border-b border-[#2d2f31] glass-panel sticky top-0 z-20 px-6 py-3.5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-[#e3e3e3]">
              {selectedLesson ? selectedLesson.title : course.title}
            </h1>
          </div>
          {selectedLesson?.isEnriched && (
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
              ✨ AI Enriched Content
            </span>
          )}
        </header>

        {/* Lesson Reader Workspace */}
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
          {lessonLoading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-[#4285f4] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-[#80868b]">Generating & retrieving lesson content...</p>
            </div>
          ) : selectedLesson ? (
            <div className="space-y-8">
              {/* Lesson Banner */}
              <div className="p-6 rounded-2xl glass-card border border-[#2d2f31] space-y-3">
                <span className="text-[10px] font-bold text-[#4285f4] uppercase tracking-wider">
                  {selectedModule?.title || 'Lesson Overview'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#e3e3e3]">
                  {selectedLesson.title}
                </h2>

                {/* Objectives */}
                {selectedLesson.objectives && selectedLesson.objectives.length > 0 && (
                  <div className="pt-3 border-t border-[#2d2f31]/60 space-y-2">
                    <h5 className="text-xs font-bold text-[#9b51e0] uppercase tracking-wider">
                      🎯 Learning Objectives
                    </h5>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedLesson.objectives.map((obj, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-[#c4c7c5] bg-[#131314]/60 p-2 rounded-lg border border-[#2d2f31]/40">
                          <span className="text-[#4285f4] font-bold">✓</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Render Blocks */}
              {selectedLesson.content && selectedLesson.content.length > 0 ? (
                <div className="p-6 sm:p-8 rounded-2xl glass-card border border-[#2d2f31]">
                  <LessonRenderer content={selectedLesson.content} />
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm">
                  ℹ️ Click a lesson in the sidebar to view full interactive content.
                </div>
              )}
            </div>
          ) : (
            <div className="py-20 text-center text-[#80868b] glass-card rounded-2xl border border-[#2d2f31] p-12">
              Select a lesson from the left syllabus tree to begin studying.
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CourseView;

