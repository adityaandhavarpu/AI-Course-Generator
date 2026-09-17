import { useState } from 'react';

const CodeBlock = ({ block }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(block.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-[#2d2f31] bg-[#0d0e0f] shadow-xl">
      {/* Code Header Bar */}
      <div className="px-4 py-2 bg-[#18191a] border-b border-[#2d2f31] flex justify-between items-center text-xs text-[#80868b]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80 inline-block" />
          <span className="ml-2 font-mono font-semibold text-[#4285f4] uppercase text-[10px]">
            {block.language || 'code'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="px-2.5 py-1 rounded bg-[#28292a] hover:bg-[#333537] text-[#c4c7c5] hover:text-white transition flex items-center gap-1 font-sans text-[11px]"
        >
          {copied ? '✓ Copied!' : '📋 Copy Code'}
        </button>
      </div>

      {/* Code Area */}
      <pre className="p-4 overflow-x-auto font-mono text-sm leading-relaxed text-[#e3e3e3]">
        <code>{block.text}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;

