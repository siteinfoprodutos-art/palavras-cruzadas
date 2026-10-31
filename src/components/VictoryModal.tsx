import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, Coins, ArrowRight, RotateCcw, Tv } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface VictoryModalProps {
  levelNumber: number;
  themeName: string;
  starsCount: number; // 1 to 3
  coinsEarned: number;
  timeTakenSeconds: number;
  isDoubledCoins: boolean;
  onNextLevel: () => void;
  onReplayLevel: () => void;
  onDoubleCoins: () => void;
  onSelectLevel: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  levelNumber,
  themeName,
  starsCount,
  coinsEarned,
  timeTakenSeconds,
  isDoubledCoins,
  onNextLevel,
  onReplayLevel,
  onDoubleCoins,
  onSelectLevel,
}) => {
  useEffect(() => {
    // Play audio fanfare
    soundManager.playLevelComplete();
    soundManager.triggerVibration([100, 50, 100, 50, 200]);

    // Fire multi-burst celebratory confetti
    try {
      const count = 100;
      const defaults = {
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'],
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    } catch {
      // Confetti fallback
    }
  }, []);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-850 p-6 text-center shadow-2xl border border-indigo-500/30">
        
        {/* Header Ribbon */}
        <div className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-4 py-1 text-xs font-black text-slate-900 uppercase tracking-wider shadow-md mb-3">
          Fase {levelNumber} Concluída!
        </div>

        <h2 className="text-xl font-black text-white">{themeName}</h2>

        {/* Stars Container with Popping Animations */}
        <div className="my-5 flex items-center justify-center space-x-3">
          {[1, 2, 3].map((starIndex) => {
            const isEarned = starIndex <= starsCount;
            const animClass =
              starIndex === 1
                ? 'animate-star-pop-1'
                : starIndex === 2
                ? 'animate-star-pop-2'
                : 'animate-star-pop-3';

            return (
              <div
                key={starIndex}
                className={`transition-all duration-300 transform ${
                  isEarned ? `${animClass} scale-110` : 'scale-90 opacity-30 grayscale'
                }`}
              >
                <Star
                  className={`h-12 w-12 ${
                    isEarned
                      ? 'fill-amber-400 text-amber-300 drop-shadow-[0_0_16px_rgba(251,191,36,0.8)]'
                      : 'text-slate-600'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Stats Summary Card */}
        <div className="my-4 rounded-2xl bg-slate-800 p-3.5 border border-slate-700/80 flex justify-around items-center">
          <div>
            <span className="block text-[11px] font-semibold text-slate-400">Tempo</span>
            <span className="text-sm font-extrabold font-mono text-indigo-300">
              {formatTime(timeTakenSeconds)}
            </span>
          </div>

          <div className="h-8 w-px bg-slate-700" />

          <div>
            <span className="block text-[11px] font-semibold text-slate-400">Recompensa</span>
            <div className="flex items-center justify-center space-x-1 text-amber-400 font-extrabold text-sm">
              <Coins className="h-4 w-4 fill-amber-400/30" />
              <span>+{coinsEarned}</span>
            </div>
          </div>
        </div>

        {/* Double Coins Ad Button */}
        {!isDoubledCoins && (
          <button
            onClick={onDoubleCoins}
            className="w-full mb-3 flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-3 px-4 font-black text-slate-950 shadow-lg hover:brightness-110 active:scale-95 transition"
          >
            <Tv className="h-5 w-5" />
            <span className="text-sm">Assistir Vídeo: Dobrar Moedas! (+{coinsEarned})</span>
          </button>
        )}

        {isDoubledCoins && (
          <div className="w-full mb-3 py-2 px-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
            ✨ Moedas Dobradas com Sucesso!
          </div>
        )}

        {/* Actions Row */}
        <div className="flex items-center space-x-2 mt-2">
          <button
            onClick={onReplayLevel}
            className="flex-1 flex items-center justify-center space-x-1 py-3 rounded-2xl bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs hover:bg-slate-750 active:scale-95 transition"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Repetir</span>
          </button>

          <button
            onClick={onNextLevel}
            className="flex-2 flex items-center justify-center space-x-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 font-extrabold text-white text-sm shadow-xl hover:brightness-110 active:scale-95 transition"
          >
            <span>Próxima Fase</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        {/* Level Select Link */}
        <button
          onClick={onSelectLevel}
          className="mt-3 text-xs text-indigo-300 hover:underline font-semibold"
        >
          Ir para Seleção de Fases
        </button>
      </div>
    </div>
  );
};
