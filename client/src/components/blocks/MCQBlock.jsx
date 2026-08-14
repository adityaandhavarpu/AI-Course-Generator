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
    <div className="mb-8">
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200 my-4">
        <div className="mb-4">
          <h4 className="text-lg font-bold text-gray-900 mb-4">❓ {block.question}</h4>
          <div className="space-y-3">
            {block.options.map((option, idx) => {
              let bgColor = 'bg-white hover:bg-gray-50';
              let borderColor = 'border-gray-300';
              let textColor = 'text-gray-700';

              if (isAnswered) {
                if (option === block.correctAnswer) {
                  bgColor = 'bg-green-100';
                  borderColor = 'border-green-500';
                  textColor = 'text-green-900 font-semibold';
                } else if (option === selectedOption && !isCorrect) {
                  bgColor = 'bg-red-100';
                  borderColor = 'border-red-500';
                  textColor = 'text-red-900 font-semibold';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(option)}
                  disabled={isAnswered}
                  className={`w-full text-left p-3 border-2 rounded-lg transition ${bgColor} ${borderColor} ${textColor} disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 rounded-full flex items-center justify-center">
                      {selectedOption === option && (
                        <div className={`w-2 h-2 rounded-full ${isCorrect ? 'bg-green-600' : 'bg-red-600'}`} />
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {isAnswered && (
          <div className={`mt-4 p-3 rounded-lg ${isCorrect ? 'bg-green-100 border border-green-400 text-green-900' : 'bg-red-100 border border-red-400 text-red-900'}`}>
            <p className="font-semibold mb-1">{isCorrect ? '✅ Correct!' : '❌ Incorrect'}</p>
            <p className="text-sm">{block.explanation}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MCQBlock;
