import katex from 'katex';

const MathText = ({ text }) => {
  if (!text) return null;

  // Render LaTeX math expressions enclosed in $...$ or $$...$$ or plain math formulas
  const renderFormattedText = (str) => {
    // Regex for inline ($...$) and block ($$...$$) math, or common LaTeX commands
    const mathRegex = /(\$\$.*?\$\$|\$.*?\$|\\\(.*?\\\)|\\\[.*?\\\])/gs;
    const parts = str.split(mathRegex);

    return parts.map((part, i) => {
      if (!part) return null;

      let isBlock = part.startsWith('$$') || part.startsWith('\\[');
      let isInline = part.startsWith('$') || part.startsWith('\\(');

      if (isBlock || isInline) {
        let mathContent = part
          .replace(/^\$\$|\$\$$|^\\\[|\\\]$/g, '')
          .replace(/^\$|\$$|^\\\(|\\\)$/g, '');

        try {
          const html = katex.renderToString(mathContent, {
            displayMode: isBlock,
            throwOnError: false,
          });
          return (
            <span
              key={i}
              className={isBlock ? "block my-4 text-center text-blue-300 overflow-x-auto" : "inline-block px-1 text-blue-300 font-serif"}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (e) {
          return <code key={i} className="text-amber-300 bg-amber-500/10 px-1 rounded">{part}</code>;
        }
      }

      // Format plain text inline math formulas like ax^2 + bx + c = 0 or x = (-b ± √d) / (2a)
      return (
        <span key={i}>
          {formatInlineMath(part)}
        </span>
      );
    });
  };

  const formatInlineMath = (plainText) => {
    // Regex to capture expressions like ax^2 + bx + c = 0, x = (-b ± √d) / (2a), d = b^2 - 4ac
    const formulaRegex = /\b([a-zA-Z0-9\(\)\s\+\-\*\/\^\=±√]+(=|>|<|≥|≤)[a-zA-Z0-9\(\)\s\+\-\*\/\^\=±√]+)\b/g;

    const tokens = plainText.split(formulaRegex);
    return tokens.map((token, idx) => {
      if (token && (token.includes('^') || token.includes('±') || token.includes('√') || (token.includes('=') && token.length < 50))) {
        try {
          // Clean standard math notations to LaTeX equivalent for pretty rendering
          let latexStr = token
            .replace(/±/g, '\\pm ')
            .replace(/√([a-zA-Z0-9]+)/g, '\\sqrt{$1}')
            .replace(/√\(([^\)]+)\)/g, '\\sqrt{$1}')
            .replace(/\^2/g, '^2')
            .replace(/\* /g, '\\cdot ');

          const html = katex.renderToString(latexStr, { throwOnError: false });
          return (
            <span
              key={idx}
              className="inline-block px-1.5 py-0.5 my-0.5 rounded bg-[#28292a] border border-[#3c3d3e] text-blue-300 font-serif text-sm sm:text-base shadow-sm"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (err) {
          return <span key={idx}>{token}</span>;
        }
      }
      return token;
    });
  };

  return (
    <div className="text-slate-300 leading-relaxed text-base sm:text-lg my-4 space-y-2">
      {renderFormattedText(text)}
    </div>
  );
};

export default MathText;
