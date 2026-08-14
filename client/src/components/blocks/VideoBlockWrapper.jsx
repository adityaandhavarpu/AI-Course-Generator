import { useState, useEffect } from 'react';

const VideoBlockWrapper = ({ block }) => {
  const query = block.query;
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVideo = async () => {
      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
      if (!apiKey) {
        setError('YouTube API key is not configured. Please set VITE_YOUTUBE_API_KEY in .env.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const params = new URLSearchParams({
          key: apiKey,
          part: 'snippet',
          q: query,
          maxResults: '3',
          type: 'video',
          videoEmbeddable: 'true',
        });

        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);
        if (!response.ok) {
          const data = await response.json().catch(() => null);
          const message = data?.error?.message || 'Unable to load video';
          throw new Error(message);
        }

        const data = await response.json();
        const items = data.items || [];
        if (items.length === 0) {
          setError('No videos found');
        } else {
          const item = items[0];
          setVideo({
            videoId: item.id.videoId,
            title: item.snippet.title,
            description: item.snippet.description,
          });
        }
      } catch (err) {
        setError(err.message || 'Unable to load video');
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [query]);

  if (loading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-600">Loading video...</div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">{error}</div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="relative pb-[56.25%]">
        <iframe
          title={video.title}
          src={`https://www.youtube.com/embed/${video.videoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{video.title}</h3>
        <p className="mt-2 text-sm text-gray-600">{video.description}</p>
      </div>
    </div>
  );
};

export default VideoBlockWrapper;
