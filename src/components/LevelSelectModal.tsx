import React, { useState } from 'react';
import { LevelConfig, PlayerData, ThemeId } from '../types/game';
import { THEMES } from '../data/levels';
import { Lock, Star, ArrowLeft, Coins, Award } from 'lucide-react';

interface LevelSelectModalProps {
  levels: LevelConfig[];
  playerData: PlayerData;
  onSelectLevel: (levelId: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  levels,
  playerData,
  onSelectLevel,
  onClose,
}) => {
  const [selectedThemeFilter, setSelectedThemeFilter] = useState<ThemeId | 'all'>('all');

  // Compute total stars collected
  const totalStars = Object.values(playerData.levelProgress).reduce(
    (acc, progress) => acc + (progress.stars || 0),
    0
  );

  const filteredLevels =
    selectedThemeFilter === 'all'
      ? levels
      : levels.filter((l) => l.themeId === selectedThemeFilter);

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-slate-900 text-white overflow-hidden animate-fade-in">
      
      {/* Top Header */}
      <header className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-850/80 backdrop-blur-md">
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 text-slate-200 border border-slate-700 active:scale-95 transition"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <h1 className="text-lg font-black text-white">Seleção de Fases</h1>

        <div className="flex items-center space-x-2">
          {/* Stars Counter */}
          <div className="flex items-center space-x-1 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-full text-amber-300 text-xs font-black">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{totalStars}</span>
          </div>

          {/* Coins Counter */}
          <div className="flex items-center space-x-1 bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-1 rounded-full text-indigo-300 text-xs font-black">
            <Coins className="h-3.5 w-3.5 text-indigo-400" />
            <span>{playerData.coins}</span>
          </div>
        </div>
      </header>

      {/* Theme Filters Ribbon */}
      <div className="p-3 border-b border-slate-800 bg-slate-900 flex space-x-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setSelectedThemeFilter('all')}
          className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
            selectedThemeFilter === 'all'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Todas ({levels.length})
        </button>

        {Object.values(THEMES).map((theme) => (
          <button
            key={theme.id}
            onClick={() => setSelectedThemeFilter(theme.id)}
            className={`shrink-0 flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedThemeFilter === theme.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <span>{theme.icon}</span>
            <span>{theme.name}</span>
          </button>
        ))}
      </div>

      {/* Level Cards Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-md mx-auto">
          {filteredLevels.map((level) => {
            const isUnlocked = level.id <= playerData.unlockedLevel;
            const progress = playerData.levelProgress[level.id];
            const stars = progress?.stars || 0;
            const theme = THEMES[level.themeId] || THEMES.animais;

            return (
              <button
                key={level.id}
                disabled={!isUnlocked}
                onClick={() => isUnlocked && onSelectLevel(level.id)}
                className={`relative flex flex-col items-center justify-between p-3 rounded-2xl border transition-all duration-200 aspect-square shadow-md ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-slate-800 to-slate-850 border-slate-700 hover:border-indigo-500 active:scale-95'
                    : 'bg-slate-900/60 border-slate-800/80 opacity-50 cursor-not-allowed'
                }`}
              >
                {/* Level Number & Theme Icon */}
                <div className="flex w-full items-center justify-between">
                  <span className="text-xs font-black text-slate-400">#{level.id}</span>
                  <span className="text-base">{theme.icon}</span>
                </div>

                {/* Center Content: Lock or Grid Size indicator */}
                <div className="my-1 flex items-center justify-center">
                  {!isUnlocked ? (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-500">
                      <Lock className="h-4 w-4" />
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                      {level.gridSize}x{level.gridSize}
                    </span>
                  )}
                </div>

                {/* Bottom Stars */}
                {isUnlocked && (
                  <div className="flex space-x-0.5">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`h-3 w-3 ${
                          s <= stars
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
