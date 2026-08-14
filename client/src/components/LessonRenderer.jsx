import HeadingBlock from './blocks/HeadingBlock';
import ParagraphBlock from './blocks/ParagraphBlock';
import CodeBlock from './blocks/CodeBlock';
import VideoBlockWrapper from './blocks/VideoBlockWrapper';
import MCQBlock from './blocks/MCQBlock';

const LessonRenderer = ({ content }) => {
  if (!content || content.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No content available yet</p>
      </div>
    );
  }

  return (
    <div className="prose prose-lg max-w-none">
      {content.map((block, idx) => {
        // Handle string content (fallback)
        if (typeof block === 'string') {
          return (
            <div key={idx} className="mb-6">
              <p className="text-gray-700 leading-relaxed">{block}</p>
            </div>
          );
        }

        // Handle object blocks by type
        switch (block.type) {
          case 'heading':
            return <HeadingBlock key={idx} block={block} />;

          case 'paragraph':
            return <ParagraphBlock key={idx} block={block} />;

          case 'code':
            return <CodeBlock key={idx} block={block} />;

          case 'video':
            return <VideoBlockWrapper key={idx} block={block} />;

          case 'mcq':
            return <MCQBlock key={idx} block={block} />;

          default:
            return null;
        }
      })}
    </div>
  );
};

export default LessonRenderer;
