const CodeBlock = ({ block }) => {
  return (
    <div className="mb-6">
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
        <div className="text-xs text-gray-400 mb-2 font-semibold">
          {block.language || 'code'}
        </div>
        <pre className="font-mono text-sm">
          <code>{block.text}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
