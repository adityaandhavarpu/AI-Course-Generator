import { useState } from 'react';

const MCQBlock = ({ block }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelectOption = (option) => {
    if (!isAnswered) {
      setSelectedOption(option);
      setIsAnswered(true);
    }
  };

  const isCorrect = selectedOption === block.correctAnswer;

  return (
    <div className="my-8 rounded-2xl glass-panel border border-[#2d2f31] p-6 space-y-4">
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded bg-[#9b51e0]/20 text-[#9b51e0] border border-[#9b51e0]/30 text-[10px] font-bold uppercase tracking-wider">
          Quiz Check
        </span>
      </div>

      <h4 className="text-base sm:text-lg font-bold text-[#e3e3e3] leading-snug">
        ❓ {block.question}
      </h4>

      <div className="space-y-2.5 pt-2">
        {block.options.map((option, idx) => {
          let bgColor = 'bg-[#1e1f20] hover:bg-[#28292a]';
          let borderColor = 'border-[#2d2f31]';
          let textColor = 'text-[#c4c7c5]';

          if (isAnswered) {
            if (option === block.correctAnswer) {
              bgColor = 'bg-emerald-500/10';
              borderColor = 'border-emerald-500/60';
              textColor = 'text-emerald-300 font-semibold';
            } else if (option === selectedOption && !isCorrect) {
              bgColor = 'bg-red-500/10';
              borderColor = 'border-red-500/60';
              textColor = 'text-red-300 font-semibold';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(option)}
              disabled={isAnswered}
              className={`w-full text-left p-3.5 border rounded-xl transition-all duration-200 ${bgColor} ${borderColor} ${textColor} disabled:cursor-default flex items-center justify-between text-xs sm:text-sm font-medium`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                  selectedOption === option ? (isCorrect ? 'border-emerald-400 bg-emerald-500/20 text-emerald-400' : 'border-red-400 bg-red-500/20 text-red-400') : 'border-[#2d2f31] text-[#80868b]'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span>{option}</span>
              </div>
              {isAnswered && option === block.correctAnswer && <span className="text-emerald-400">✓ Correct</span>}
              {isAnswered && option === selectedOption && !isCorrect && <span className="text-red-400">✕ Incorrect</span>}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className={`mt-4 p-4 rounded-xl border text-xs sm:text-sm space-y-1 ${
          isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'
        }`}>
          <p className="font-bold flex items-center gap-1.5">
            <span>{isCorrect ? '✅ Well done!' : '❌ Incorrect'}</span>
          </p>
          <p className="text-xs text-[#c4c7c5] leading-relaxed">{block.explanation}</p>
        </div>
      )}
    </div>
  );
};

export default MCQBlock;

