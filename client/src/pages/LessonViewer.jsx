import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { lessonAPI } from '../api/client';
import LessonRenderer from '../components/LessonRenderer';
import LessonPDFExporter from '../components/LessonPDFExporter';

const LessonViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLesson();
  }, [id]);

  const fetchLesson = async () => {
    try {
      setLoading(true);
      // Backend will enrich if not already enriched
      const response = await lessonAPI.getLessonById(id);
      setLesson(response.data);
    } catch (err) {
      setError('Failed to load lesson');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (error && !lesson) {
    return (
      <div className="min-h-screen bg-[#131314] text-slate-100 flex items-center justify-center p-4">
        <div className="bg-[#1e1f20] border border-[#2f3031] p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
          <p className="text-red-400 mb-6 text-lg">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-[#2f3031] text-slate-200 hover:text-white hover:bg-[#3c3d3e] font-medium px-6 py-3 rounded-xl transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#131314] text-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-300 mx-auto"></div>
          <p className="mt-4 text-slate-400 text-lg font-medium">Generating AI Lesson Content...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-[#131314] text-slate-100 flex items-center justify-center p-4">
        <div className="bg-[#1e1f20] border border-[#2f3031] p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
          <p className="text-slate-400 mb-6 text-lg">Lesson not found</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-[#2f3031] text-slate-200 hover:text-white hover:bg-[#3c3d3e] font-medium px-6 py-3 rounded-xl transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#131314] text-slate-100 font-sans">
      {/* Header */}
      <header className="border-b border-[#2f3031] bg-[#1e1f20]/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 text-slate-400 hover:text-white flex items-center gap-2 text-sm font-medium transition"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-100 via-slate-200 to-slate-400 bg-clip-text text-transparent mb-2">
            {lesson.title}
          </h1>
          <div className="flex items-center gap-2 text-xs font-semibold">
            {lesson.isEnriched ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ✅ Enriched Content
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                ⏳ Generating Content...
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* PDF Export Button */}
        <div>
          <LessonPDFExporter lesson={lesson} />
        </div>

        {/* Learning Objectives */}
        {lesson.objectives && lesson.objectives.length > 0 && (
          <div className="bg-[#1e1f20] border border-[#2f3031] p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
              <span>📚</span> Learning Objectives
            </h2>
            <ul className="space-y-3">
              {lesson.objectives.map((objective, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm leading-relaxed">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Content Blocks */}
        <div className="bg-[#1e1f20] border border-[#2f3031] rounded-2xl shadow-xl p-8">
          <LessonRenderer content={lesson.content} />
        </div>
      </main>
    </div>
  );
};

export default LessonViewer;
