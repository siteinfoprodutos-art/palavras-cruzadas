import React from 'react';
import { Play, RotateCcw, Settings, Home, X } from 'lucide-react';

interface PauseModalProps {
  levelNumber: number;
  themeName: string;
  onResume: () => void;
  onRestart: () => void;
  onOpenSettings: () => void;
  onExitToMenu: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  levelNumber,
  themeName,
  onResume,
  onRestart,
  onOpenSettings,
  onExitToMenu,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-xs sm:max-w-sm rounded-3xl bg-slate-850 p-5 sm:p-6 text-center shadow-2xl border border-indigo-500/30">
        
        {/* Close Button */}
        <button
          onClick={onResume}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white"
          aria-label="Continuar Jogo"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Title */}
        <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black uppercase tracking-wider mb-2">
          <span>Jogo Pausado</span>
        </div>

        <h2 className="text-lg sm:text-xl font-black text-white">
          Fase {levelNumber} • {themeName}
        </h2>

        {/* Action Buttons */}
        <div className="my-5 flex flex-col space-y-2.5">
          
          {/* Resume */}
          <button
            onClick={onResume}
            className="flex items-center justify-center space-x-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-indigo-600 font-black text-white text-sm shadow-lg hover:brightness-110 active:scale-95 transition"
          >
            <Play className="h-5 w-5 fill-current" />
            <span>Continuar</span>
          </button>

          {/* Restart */}
          <button
            onClick={onRestart}
            className="flex items-center justify-center space-x-2 w-full py-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs hover:bg-slate-750 active:scale-95 transition"
          >
            <RotateCcw className="h-4 w-4 text-indigo-400" />
            <span>Reiniciar Fase</span>
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="flex items-center justify-center space-x-2 w-full py-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs hover:bg-slate-750 active:scale-95 transition"
          >
            <Settings className="h-4 w-4 text-indigo-400" />
            <span>Configurações</span>
          </button>

          {/* Exit to Menu */}
          <button
            onClick={onExitToMenu}
            className="flex items-center justify-center space-x-2 w-full py-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 font-bold text-xs hover:bg-rose-500/25 active:scale-95 transition"
          >
            <Home className="h-4 w-4 text-rose-400" />
            <span>Menu Principal</span>
          </button>

        </div>

      </div>
    </div>
  );
};
