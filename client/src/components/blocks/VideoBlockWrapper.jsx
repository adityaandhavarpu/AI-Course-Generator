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
      <div className="rounded-xl border border-[#2d2f31] glass-card p-6 text-center text-xs text-[#80868b] my-4">
        Loading video...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-xs text-red-400 my-4">
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#2d2f31] glass-card overflow-hidden my-6 shadow-xl">
      <div className="relative pb-[56.25%] bg-[#0d0e0f]">
        <iframe
          title={video.title}
          src={`https://www.youtube.com/embed/${video.videoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <div className="p-4 space-y-1">
        <h4 className="text-sm font-bold text-[#e3e3e3]">{video.title}</h4>
        <p className="text-xs text-[#80868b] line-clamp-2">{video.description}</p>
      </div>
    </div>
  );
};

export default VideoBlockWrapper;

