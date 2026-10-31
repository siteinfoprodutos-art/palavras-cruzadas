import React from 'react';
import { Volume2, VolumeX, ArrowLeft, Settings, Coins, Plus, Clock, Pause } from 'lucide-react';
import { THEMES } from '../data/levels';
import { ThemeId } from '../types/game';

interface HeaderProps {
  levelNumber: number;
  themeId: ThemeId;
  themeName: string;
  coins: number;
  soundEnabled: boolean;
  timerSeconds: number;
  onBack: () => void;
  onPause: () => void;
  onToggleSound: () => void;
  onOpenSettings: () => void;
  onWatchAdForCoins: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  levelNumber,
  themeId,
  themeName,
  coins,
  soundEnabled,
  timerSeconds,
  onBack,
  onPause,
  onToggleSound,
  onOpenSettings,
  onWatchAdForCoins,
}) => {
  const theme = THEMES[themeId] || THEMES.animais;

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="w-full max-w-md mx-auto px-2 sm:px-4 pt-2 pb-1 flex flex-col space-y-1.5">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between gap-1">
        
        {/* Back / Pause Button */}
        <div className="flex items-center space-x-1 shrink-0">
          <button
            onClick={onBack}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-slate-800 text-slate-200 border border-slate-700 active:scale-95 transition shadow-sm"
            aria-label="Voltar ao menu"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>

          <button
            onClick={onPause}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 active:scale-95 transition shadow-sm hover:bg-indigo-600/40"
            aria-label="Pausar jogo"
          >
            <Pause className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
          </button>
        </div>

        {/* Level & Theme Pill */}
        <div className="flex items-center space-x-1.5 bg-slate-800/90 border border-slate-700/80 px-2.5 py-1 rounded-full shadow-inner truncate max-w-[130px] sm:max-w-[170px]">
          <span className="text-base sm:text-lg shrink-0">{theme.icon}</span>
          <div className="flex flex-col text-left truncate">
            <span className="text-[11px] sm:text-xs font-bold text-slate-200 leading-tight">
              Fase {levelNumber}
            </span>
            <span className="text-[9px] sm:text-[10px] text-indigo-300 font-medium leading-tight truncate">
              {themeName}
            </span>
          </div>
        </div>

        {/* Right Stats & Actions */}
        <div className="flex items-center space-x-1 shrink-0">
          
          {/* Coin Badge */}
          <button
            onClick={onWatchAdForCoins}
            className="flex items-center space-x-1 bg-amber-500/15 border border-amber-500/30 px-2 py-1 rounded-full text-amber-400 font-black text-xs active:scale-95 transition shadow-sm hover:bg-amber-500/25"
            title="Assistir anúncio para ganhar 50 moedas"
          >
            <Coins className="h-3.5 w-3.5 text-amber-400 fill-amber-400/30" />
            <span>{coins}</span>
            <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-500 text-slate-900 font-extrabold text-[9px]">
              <Plus className="h-2.5 w-2.5 stroke-[3]" />
            </div>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-slate-800 text-slate-200 border border-slate-700 active:scale-95 transition shadow-sm"
            aria-label={soundEnabled ? 'Desativar Som' : 'Ativar Som'}
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-400" />
            ) : (
              <VolumeX className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500" />
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-slate-800 text-slate-200 border border-slate-700 active:scale-95 transition shadow-sm"
            aria-label="Configurações"
          >
            <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-slate-300" />
          </button>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="flex items-center justify-center space-x-1.5 text-xs font-semibold text-slate-400">
        <Clock className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
        <span>Tempo: <strong className="text-white font-mono text-xs sm:text-sm">{formatTime(timerSeconds)}</strong></span>
      </div>
    </header>
  );
};
