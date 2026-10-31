import React from 'react';
import { Lightbulb, Eye, Tv, Coins } from 'lucide-react';

interface PowerupsBarProps {
  coins: number;
  onUseHintLetter: () => void;
  onUseRevealWord: () => void;
  onWatchAdForHints: () => void;
  hintCost?: number;
  revealCost?: number;
}

export const PowerupsBar: React.FC<PowerupsBarProps> = ({
  coins,
  onUseHintLetter,
  onUseRevealWord,
  onWatchAdForHints,
  hintCost = 25,
  revealCost = 60,
}) => {
  return (
    <div className="w-full max-w-md mx-auto px-2 sm:px-4 my-1 sm:my-2">
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2.5">
        
        {/* Hint Letter Button */}
        <button
          onClick={onUseHintLetter}
          className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl border transition active:scale-95 shadow-md ${
            coins >= hintCost
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
              : 'bg-slate-800/50 border-slate-700/50 text-slate-500 opacity-60'
          }`}
        >
          <div className="flex items-center space-x-1">
            <Lightbulb className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400 fill-amber-400/30 shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold truncate">1ª Letra</span>
          </div>
          <div className="mt-0.5 flex items-center space-x-0.5 text-[10px] sm:text-[11px] font-extrabold text-amber-400">
            <Coins className="h-3 w-3" />
            <span>{hintCost}</span>
          </div>
        </button>

        {/* Reveal Word Button */}
        <button
          onClick={onUseRevealWord}
          className={`flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl border transition active:scale-95 shadow-md ${
            coins >= revealCost
              ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/25'
              : 'bg-slate-800/50 border-slate-700/50 text-slate-500 opacity-60'
          }`}
        >
          <div className="flex items-center space-x-1">
            <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-400 shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold truncate">Revelar</span>
          </div>
          <div className="mt-0.5 flex items-center space-x-0.5 text-[10px] sm:text-[11px] font-extrabold text-indigo-400">
            <Coins className="h-3 w-3" />
            <span>{revealCost}</span>
          </div>
        </button>

        {/* Watch Ad for Hints/Coins */}
        <button
          onClick={onWatchAdForHints}
          className="flex flex-col items-center justify-center p-2 sm:p-2.5 rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/40 text-purple-300 hover:from-purple-600/30 hover:to-pink-600/30 transition active:scale-95 shadow-md"
        >
          <div className="flex items-center space-x-1">
            <Tv className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-pink-400 shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold truncate">+3 Dicas</span>
          </div>
          <span className="mt-0.5 text-[9px] sm:text-[10px] font-semibold text-pink-400 truncate">
            Assistir Vídeo
          </span>
        </button>

      </div>
    </div>
  );
};
