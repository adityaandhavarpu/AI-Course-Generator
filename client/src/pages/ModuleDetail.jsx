import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { moduleAPI } from '../api/client';

const ModuleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchModule();
  }, [id]);

  const fetchModule = async () => {
    try {
      setLoading(true);
      const response = await moduleAPI.getModuleById(id);
      setModule(response.data);
    } catch (err) {
      setError('Failed to load module');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading module...</p>
        </div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Module not found'}</p>
          <button
            onClick={() => navigate('/')}
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
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <button
            onClick={() => navigate('/')}
            className="mb-4 text-purple-100 hover:text-white flex items-center gap-2 transition"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold mb-2">{module.title}</h1>
          <p className="text-purple-100">Choose a lesson to generate and read its content.</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">📖 Lessons</h2>

          {module.lessons && module.lessons.length > 0 ? (
            <div className="space-y-4">
              {module.lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  onClick={() => navigate(`/lessons/${lesson.id}`)}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer p-6 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                        Lesson {idx + 1}: {lesson.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        {lesson.isEnriched ? (
                          <span className="text-green-600">✅ Enriched</span>
                        ) : (
                          <span className="text-yellow-600">⏳ Not enriched</span>
                        )}
                      </div>
                    </div>
                    <div className="text-2xl">→</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-600">No lessons found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ModuleDetail;
