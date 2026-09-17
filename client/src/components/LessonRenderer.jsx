import { useState } from 'react';
import HeadingBlock from './blocks/HeadingBlock';
import ParagraphBlock from './blocks/ParagraphBlock';
import CodeBlock from './blocks/CodeBlock';
import VideoBlockWrapper from './blocks/VideoBlockWrapper';
import MCQBlock from './blocks/MCQBlock';

const LessonRenderer = ({ content }) => {
  // Bucket blocks by type
  const contentBlocks = (content || []).filter(b => typeof b === 'string' || b.type === 'heading' || b.type === 'paragraph');
  const codeBlocks   = (content || []).filter(b => typeof b === 'object' && b.type === 'code');
  const videoBlocks  = (content || []).filter(b => typeof b === 'object' && b.type === 'video');
  const mcqBlocks    = (content || []).filter(b => typeof b === 'object' && b.type === 'mcq');

  // Build tab list dynamically based on what exists
  const tabs = [
    contentBlocks.length > 0 && { id: 'content', label: 'Content', icon: '📖', count: contentBlocks.length, color: 'blue' },
    codeBlocks.length > 0   && { id: 'code',    label: 'Code',    icon: '💻', count: codeBlocks.length,   color: 'purple' },
    videoBlocks.length > 0  && { id: 'video',   label: 'Videos',  icon: '🎥', count: videoBlocks.length,  color: 'rose' },
    mcqBlocks.length > 0    && { id: 'mcq',     label: 'Exercises', icon: '❓', count: mcqBlocks.length,  color: 'emerald' },
  ].filter(Boolean);

  const [activeTab, setActiveTab] = useState(tabs.length > 0 ? tabs[0].id : 'content');

  if (!content || content.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <p className="text-lg font-medium">No lesson content available yet</p>
      </div>
    );
  }

  const activeColors = {
    blue:    'bg-[#4285f4] text-white shadow-blue-500/20',
    purple:  'bg-[#9b51e0] text-white shadow-purple-500/20',
    rose:    'bg-rose-600 text-white shadow-rose-500/20',
    emerald: 'bg-emerald-600 text-white shadow-emerald-500/20',
  };

  const renderContentBlock = (block, idx) => {
    if (typeof block === 'string') return <ParagraphBlock key={idx} block={{ text: block }} />;
    switch (block.type) {
      case 'heading':   return <HeadingBlock   key={idx} block={block} />;
      case 'paragraph': return <ParagraphBlock key={idx} block={block} />;
      default:          return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      {tabs.length > 1 && (
        <div className="flex flex-wrap gap-2 pb-4 border-b border-[#2f3031]">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg ${
                activeTab === tab.id
                  ? activeColors[tab.color]
                  : 'bg-[#28292a] text-slate-400 hover:text-white hover:bg-[#38393a]'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'content' && (
        <div className="space-y-4">
          {contentBlocks.map((block, idx) => renderContentBlock(block, idx))}
        </div>
      )}

      {activeTab === 'code' && (
        <div className="space-y-6">
          {codeBlocks.map((block, idx) => (
            <CodeBlock key={idx} block={block} />
          ))}
        </div>
      )}

      {activeTab === 'video' && (
        <div className="space-y-6">
          {videoBlocks.map((block, idx) => (
            <VideoBlockWrapper key={idx} block={block} />
          ))}
        </div>
      )}

      {activeTab === 'mcq' && (
        <div className="space-y-6">
          {mcqBlocks.map((block, idx) => (
            <MCQBlock key={idx} block={block} />
          ))}
        </div>
      )}
    </div>
  );
};

export default LessonRenderer;
