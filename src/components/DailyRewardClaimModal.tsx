import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Gift, Coins, Sparkles, Check } from 'lucide-react';
import { soundManager } from '../utils/audio';
import { DAILY_REWARDS } from '../utils/dailyChallenge';

interface DailyRewardClaimModalProps {
  streakDay: number;
  onClaim: () => void;
}

export const DailyRewardClaimModal: React.FC<DailyRewardClaimModalProps> = ({
  streakDay,
  onClaim,
}) => {
  const rewardInfo = DAILY_REWARDS.find((r) => r.day === streakDay) || DAILY_REWARDS[0];

  useEffect(() => {
    soundManager.playLevelComplete();
    soundManager.triggerVibration([100, 50, 100, 50, 200]);

    try {
      confetti({
        particleCount: rewardInfo.isChest ? 120 : 80,
        spread: 80,
        origin: { y: 0.5 },
        colors: rewardInfo.isChest
          ? ['#f59e0b', '#fbbf24', '#ec4899', '#8b5cf6', '#3b82f6']
          : ['#10b981', '#3b82f6', '#f59e0b'],
      });
    } catch {
      // Confetti fallback
    }
  }, [rewardInfo.isChest]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-850 p-6 text-center shadow-2xl border-2 border-amber-400/50">
        
        {/* Top Header Badge */}
        <div className="inline-flex items-center space-x-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-4 py-1 text-xs font-black text-slate-950 uppercase shadow-md mb-2">
          <span>DESAFIO DIÁRIO CONCLUÍDO!</span>
        </div>

        <h2 className="text-2xl font-black text-white">Recompensa do Dia {streakDay}</h2>

        {/* Big Chest or Coins Banner */}
        <div className="my-6 flex flex-col items-center justify-center p-6 rounded-3xl bg-gradient-to-b from-indigo-900/60 to-purple-900/60 border border-amber-400/30 shadow-inner">
          {rewardInfo.isChest ? (
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-amber-500/20 text-5xl shadow-xl animate-bounce">
              🎁
              <Sparkles className="absolute -top-2 -right-2 h-7 w-7 text-amber-300 animate-spin" />
            </div>
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-500/20 text-4xl shadow-xl animate-bounce">
              🪙
            </div>
          )}

          <div className="mt-4 flex items-center space-x-2 text-2xl font-black text-amber-300">
            <Coins className="h-6 w-6 fill-amber-400/30" />
            <span>+{rewardInfo.coins} Moedas</span>
          </div>

          {rewardInfo.hintsBonus && (
            <div className="mt-1 flex items-center space-x-1.5 text-xs font-black text-pink-300 bg-pink-500/20 px-3 py-1 rounded-full border border-pink-500/30">
              <Sparkles className="h-4 w-4 text-pink-400" />
              <span>BÔNUS DO BAÚ: +{rewardInfo.hintsBonus} Dicas Grátis!</span>
            </div>
          )}
        </div>

        {/* Claim CTA */}
        <button
          onClick={onClaim}
          className="w-full flex items-center justify-center space-x-2 py-4 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 font-black text-slate-950 text-base shadow-xl hover:brightness-110 active:scale-95 transition"
        >
          <Check className="h-5 w-5 stroke-[3]" />
          <span>RESGATAR RECOMPENSA</span>
        </button>

      </div>
    </div>
  );
};
