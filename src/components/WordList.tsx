import React from 'react';
import { WordPlacement } from '../types/game';
import { Check } from 'lucide-react';

interface WordListProps {
  placements: WordPlacement[];
}

export const WordList: React.FC<WordListProps> = ({ placements }) => {
  const totalWords = placements.length;
  const foundWordsCount = placements.filter((p) => p.found).length;

  return (
    <div className="w-full max-w-md mx-auto px-2 sm:px-4 my-1 flex flex-col space-y-1">
      {/* Header Progress indicator */}
      <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-300 px-1">
        <span>PALAVRAS ENCONTRADAS</span>
        <span className="text-indigo-400 font-mono">
          {foundWordsCount} / {totalWords}
        </span>
      </div>

      {/* Word Badges Container */}
      <div className="flex flex-wrap justify-center gap-1.5 max-h-28 sm:max-h-36 overflow-y-auto p-1.5 rounded-2xl bg-slate-850/60 border border-slate-800 backdrop-blur-sm">
        {placements.map((placement, idx) => {
          const { displayWord, found, color } = placement;

          return (
            <div
              key={idx}
              className={`flex items-center space-x-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-300 shadow-sm ${
                found
                  ? 'text-white scale-100 opacity-90 line-through decoration-white/70 decoration-2'
                  : 'bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600'
              }`}
              style={{
                backgroundColor: found ? color : undefined,
              }}
            >
              {found && <Check className="h-3 w-3 stroke-[3] text-white shrink-0 no-underline" />}
              <span>{displayWord}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
