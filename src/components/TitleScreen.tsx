import React, { useState, useEffect } from 'react';
import { Play, Grid, Sparkles, Volume2, VolumeX, ShieldCheck, HelpCircle, Coins, Flame, Gift, Clock, ShoppingBag } from 'lucide-react';
import { PlayerData } from '../types/game';
import { THEMES } from '../data/levels';
import { getDailyThemeId, getTimeUntilMidnight, isDailyChallengeCompletedToday, calculateNextStreak } from '../utils/dailyChallenge';

import { PWAInstallButton } from './PWAInstallButton';

interface TitleScreenProps {
  playerData: PlayerData;
  onStartGame: () => void;
  onOpenLevelSelect: () => void;
  onStartQuickGame: () => void;
  onOpenDailyChallenge: () => void;
  onOpenShop: () => void;
  onToggleSound: () => void;
  onOpenTutorial: () => void;
  onRemoveAds: () => void;
  onWatchAdForCoins: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  playerData,
  onStartGame,
  onOpenLevelSelect,
  onStartQuickGame,
  onOpenDailyChallenge,
  onOpenShop,
  onToggleSound,
  onOpenTutorial,
  onRemoveAds,
  onWatchAdForCoins,
}) => {
  const [countdown, setCountdown] = useState(getTimeUntilMidnight().formatted);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getTimeUntilMidnight().formatted);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const todayCompleted = isDailyChallengeCompletedToday(playerData.dailyStreak.lastCompletedDate);
  const streakDay = calculateNextStreak(playerData.dailyStreak.lastCompletedDate, playerData.dailyStreak.currentStreak);
  const themeId = getDailyThemeId();
  const theme = THEMES[themeId] || THEMES.animais;

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between bg-slate-900 p-6 text-white overflow-hidden select-none">
      
      {/* Background Animated Gradient Blobs */}
      <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute top-1/3 -right-20 h-80 w-80 rounded-full bg-purple-600/20 blur-3xl animate-pulse delay-1000" />
      <div className="pointer-events-none absolute -bottom-20 left-10 h-72 w-72 rounded-full bg-emerald-600/20 blur-3xl animate-pulse delay-500" />

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between">
        
        {/* Coins Pill */}
        <button
          onClick={onWatchAdForCoins}
          className="flex items-center space-x-1.5 bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 rounded-full text-amber-300 font-extrabold text-xs active:scale-95 transition shadow-md hover:bg-amber-500/25"
          title="Assistir vídeo para ganhar moedas"
        >
          <Coins className="h-4 w-4 text-amber-400 fill-amber-400/30" />
          <span>{playerData.coins} Moedas</span>
        </button>

        {/* Right Actions: PWA Install, Shop, Tutorial & Sound */}
        <div className="flex items-center space-x-2">
          <PWAInstallButton />

          <button
            onClick={onOpenShop}
            className="flex items-center space-x-1 px-3 h-10 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 font-black text-xs active:scale-95 transition shadow-sm hover:bg-amber-500/30"
            aria-label="Loja de Temas"
          >
            <ShoppingBag className="h-4 w-4 text-amber-400" />
            <span>LOJA</span>
          </button>

          <button
            onClick={onOpenTutorial}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 text-slate-300 border border-slate-700 active:scale-95 transition shadow-sm"
            aria-label="Como Jogar"
          >
            <HelpCircle className="h-5 w-5" />
          </button>

          <button
            onClick={onToggleSound}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 text-slate-300 border border-slate-700 active:scale-95 transition shadow-sm"
            aria-label={playerData.soundEnabled ? 'Mutar Som' : 'Ativar Som'}
          >
            {playerData.soundEnabled ? (
              <Volume2 className="h-5 w-5 text-indigo-400" />
            ) : (
              <VolumeX className="h-5 w-5 text-slate-500" />
            )}
          </button>
        </div>

      </div>

      {/* Center Branding & Logo */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center py-4">
        
        {/* Decorative Floating Letter Tiles */}
        <div className="flex space-x-2 mb-3">
          {['C', 'A', 'Ç', 'A'].map((char, i) => (
            <div
              key={i}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-b from-indigo-500 to-indigo-700 text-2xl font-black text-white shadow-lg border border-indigo-400/40 transform hover:-translate-y-1 transition"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {char}
            </div>
          ))}
        </div>

        <div className="flex space-x-1.5 mb-5">
          {['P', 'A', 'L', 'A', 'V', 'R', 'A', 'S'].map((char, i) => (
            <div
              key={i}
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-b from-purple-600 to-pink-600 text-base sm:text-lg font-black text-white shadow-md border border-purple-400/40"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {char}
            </div>
          ))}
        </div>

        {/* Subtitle Badge */}
        <div className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-400">
          <span>🇧🇷 Brasil Mobile Edition</span>
        </div>

      </div>

      {/* Bottom Main Action Buttons */}
      <div className="relative z-10 flex flex-col space-y-3 max-w-sm mx-auto w-full">
        
        {/* Daily Challenge Banner Card */}
        <button
          onClick={onOpenDailyChallenge}
          className="relative flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-600/20 to-indigo-600/20 border border-amber-400/40 shadow-lg hover:brightness-110 active:scale-95 transition text-left"
        >
          <div className="flex items-center space-x-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-slate-950 font-black shadow-md">
              <Flame className="h-6 w-6 fill-current animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-black text-amber-300">DESAFIO DIÁRIO</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-extrabold px-1.5 py-0.5 rounded-full border border-amber-400/30">
                  Dia {streakDay}
                </span>
              </div>
              <p className="text-xs font-bold text-white mt-0.5">
                {theme.icon} {theme.name}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            {todayCompleted ? (
              <span className="inline-flex items-center space-x-1 text-[11px] font-extrabold text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Feito</span>
              </span>
            ) : (
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-indigo-300 font-bold flex items-center space-x-1">
                  <Clock className="h-3 w-3 animate-pulse" />
                  <span>{countdown}</span>
                </span>
                <span className="text-[11px] font-black text-amber-400 hover:underline">
                  Jogar &gt;
                </span>
              </div>
            )}
          </div>
        </button>

        {/* Play Current Level Button */}
        <button
          onClick={onStartGame}
          className="flex items-center justify-center space-x-3 w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 text-white font-black text-lg shadow-xl shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition border border-emerald-400/30"
        >
          <Play className="h-6 w-6 fill-current text-white" />
          <span>CONTINUAR (FASE {playerData.unlockedLevel})</span>
        </button>

        {/* Level Select & Quick Game Row */}
        <div className="flex space-x-3">
          <button
            onClick={onOpenLevelSelect}
            className="flex-1 flex items-center justify-center space-x-2 py-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-slate-200 font-extrabold text-xs hover:bg-slate-750 active:scale-95 transition shadow-md"
          >
            <Grid className="h-4 w-4 text-indigo-400" />
            <span>FASES</span>
          </button>

          <button
            onClick={onStartQuickGame}
            className="flex-1 flex items-center justify-center space-x-2 py-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-slate-200 font-extrabold text-xs hover:bg-slate-750 active:scale-95 transition shadow-md"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>JOGO RÁPIDO</span>
          </button>
        </div>

        {/* Remove Ads Option */}
        {!playerData.isAdFree && (
          <button
            onClick={onRemoveAds}
            className="flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-purple-900/30 border border-purple-500/30 text-purple-300 font-bold text-xs hover:bg-purple-900/50 transition"
          >
            <Gift className="h-3.5 w-3.5 text-amber-400" />
            <span>Remover Anúncios</span>
          </button>
        )}

        {playerData.isAdFree && (
          <div className="flex items-center justify-center space-x-1.5 py-1 text-[11px] font-semibold text-emerald-400">
            <ShieldCheck className="h-4 w-4" />
            <span>Sem Anúncios (Ativo)</span>
          </div>
        )}

      </div>

    </div>
  );
};
