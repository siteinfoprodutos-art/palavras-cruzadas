import React, { useState, useEffect } from 'react';
import { DailyStreakData } from '../types/game';
import { THEMES } from '../data/levels';
import {
  DAILY_REWARDS,
  getDailyThemeId,
  getTimeUntilMidnight,
  isDailyChallengeCompletedToday,
  calculateNextStreak,
} from '../utils/dailyChallenge';
import { X, Flame, Gift, Clock, Check, Coins, Play, Sparkles } from 'lucide-react';

interface DailyChallengeModalProps {
  dailyStreak: DailyStreakData;
  onStartDailyChallenge: () => void;
  onClose: () => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  dailyStreak,
  onStartDailyChallenge,
  onClose,
}) => {
  const [countdown, setCountdown] = useState(getTimeUntilMidnight().formatted);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getTimeUntilMidnight().formatted);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const todayCompleted = isDailyChallengeCompletedToday(dailyStreak.lastCompletedDate);
  const nextStreakDay = calculateNextStreak(dailyStreak.lastCompletedDate, dailyStreak.currentStreak);
  const activeThemeId = getDailyThemeId();
  const theme = THEMES[activeThemeId] || THEMES.animais;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-850 p-6 text-center shadow-2xl border border-indigo-500/40 overflow-hidden">
        
        {/* Top Header & Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Title Header */}
        <div className="inline-flex items-center space-x-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 px-3.5 py-1 text-xs font-black text-amber-400 border border-amber-500/30 mb-2">
          <Flame className="h-4 w-4 text-amber-400 fill-amber-400/30 animate-bounce" />
          <span>DESAFIO DIÁRIO</span>
        </div>

        <h2 className="text-xl font-black text-white">Sequência Diária</h2>
        <p className="mt-0.5 text-xs text-slate-400">
          Jogue todos os dias para desbloquear recompensas crescentes e o Baú de Bônus!
        </p>

        {/* 7-Day Streak Rewards Track Grid */}
        <div className="my-4 grid grid-cols-4 gap-2">
          {DAILY_REWARDS.map((reward) => {
            const isChest = reward.isChest;
            const isCompletedStep =
              todayCompleted
                ? reward.day <= dailyStreak.currentStreak
                : reward.day < nextStreakDay;
            const isCurrentStep =
              !todayCompleted && reward.day === nextStreakDay;

            return (
              <div
                key={reward.day}
                className={`relative flex flex-col items-center justify-between p-2 rounded-2xl border transition-all ${
                  isChest ? 'col-span-2 aspect-[2/1]' : 'aspect-square'
                } ${
                  isCurrentStep
                    ? 'bg-gradient-to-b from-indigo-600/40 to-purple-600/40 border-amber-400 scale-105 shadow-lg shadow-indigo-500/30 ring-2 ring-amber-400/60'
                    : isCompletedStep
                    ? 'bg-slate-800/80 border-emerald-500/50 opacity-90'
                    : 'bg-slate-800/40 border-slate-700/60 opacity-60'
                }`}
              >
                {/* Day Badge */}
                <span className="text-[10px] font-black uppercase text-slate-300">
                  Dia {reward.day}
                </span>

                {/* Reward Visual Icon */}
                <div className="my-1">
                  {isChest ? (
                    <div className="flex items-center space-x-1 text-amber-400">
                      <Gift className="h-6 w-6 fill-amber-400/30 animate-bounce" />
                      <span className="text-xs font-black text-amber-300">+500 & 💡3</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1 text-amber-400 font-black text-xs">
                      <Coins className="h-3.5 w-3.5 fill-amber-400/30" />
                      <span>{reward.coins}</span>
                    </div>
                  )}
                </div>

                {/* Status Check or Lock */}
                {isCompletedStep ? (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-slate-950">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                ) : isCurrentStep ? (
                  <span className="text-[9px] font-extrabold text-amber-400 uppercase tracking-wide">
                    Hoje
                  </span>
                ) : (
                  <span className="text-[9px] text-slate-500 font-bold">Bloqueado</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Today's Theme Banner */}
        <div className="my-3 flex items-center justify-between rounded-2xl bg-slate-800 p-3 border border-slate-700">
          <div className="flex items-center space-x-2.5">
            <span className="text-2xl">{theme.icon}</span>
            <div className="text-left">
              <span className="block text-[10px] font-bold text-slate-400 uppercase">Tema de Hoje</span>
              <span className="text-xs font-black text-white">{theme.name}</span>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center space-x-1 text-[11px] font-bold text-indigo-300">
              <Clock className="h-3.5 w-3.5 animate-pulse text-indigo-400" />
              <span>Novo em</span>
            </div>
            <span className="text-xs font-mono font-bold text-white">{countdown}</span>
          </div>
        </div>

        {/* Main CTA Button */}
        {!todayCompleted ? (
          <button
            onClick={onStartDailyChallenge}
            className="w-full mt-2 flex items-center justify-center space-x-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 font-black text-slate-950 text-sm shadow-xl hover:brightness-110 active:scale-95 transition"
          >
            <Play className="h-5 w-5 fill-current text-slate-950" />
            <span>JOGAR DESAFIO DO DIA (DIA {nextStreakDay})</span>
          </button>
        ) : (
          <div className="w-full mt-2 py-3 px-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-extrabold flex items-center justify-center space-x-2">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>Desafio de Hoje Concluído! Volte amanhã.</span>
          </div>
        )}

      </div>
    </div>
  );
};
