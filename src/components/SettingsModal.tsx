import React, { useState } from 'react';
import { X, Volume2, VolumeX, Smartphone, ShieldCheck, RotateCcw, Sparkles, AlertTriangle } from 'lucide-react';

interface SettingsModalProps {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  isAdFree: boolean;
  onToggleSound: () => void;
  onToggleVibration: () => void;
  onRemoveAds: () => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  soundEnabled,
  vibrationEnabled,
  isAdFree,
  onToggleSound,
  onToggleVibration,
  onRemoveAds,
  onResetProgress,
  onClose,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-850 p-5 sm:p-6 text-center shadow-2xl border border-slate-700">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="text-xl font-black text-white">Configurações</h2>
        <p className="mt-0.5 text-xs text-slate-400">Ajustes gerais do jogo</p>

        <div className="my-5 flex flex-col space-y-3 text-left">
          
          {/* Sound Toggle */}
          <div className="flex items-center justify-between rounded-2xl bg-slate-800 p-3.5 border border-slate-700">
            <div className="flex items-center space-x-3">
              {soundEnabled ? (
                <Volume2 className="h-5 w-5 text-indigo-400" />
              ) : (
                <VolumeX className="h-5 w-5 text-slate-500" />
              )}
              <span className="text-xs font-bold text-white">Efeitos Sonoros</span>
            </div>
            <button
              onClick={onToggleSound}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                soundEnabled ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Vibration Toggle */}
          <div className="flex items-center justify-between rounded-2xl bg-slate-800 p-3.5 border border-slate-700">
            <div className="flex items-center space-x-3">
              <Smartphone className={`h-5 w-5 ${vibrationEnabled ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span className="text-xs font-bold text-white">Vibração ao Tocar</span>
            </div>
            <button
              onClick={onToggleVibration}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                vibrationEnabled ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  vibrationEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Remove Ads Button */}
          <div className="rounded-2xl bg-gradient-to-r from-purple-900/40 to-indigo-900/40 p-3.5 border border-purple-500/30">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                <span className="text-xs font-bold text-white">Versão Sem Anúncios</span>
              </div>
              {isAdFree && (
                <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Ativo</span>
                </span>
              )}
            </div>

            {!isAdFree && (
              <button
                onClick={onRemoveAds}
                className="w-full mt-1 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 font-black text-slate-950 text-xs shadow-md hover:brightness-110 active:scale-95 transition"
              >
                Remover Anúncios (Compra Única)
              </button>
            )}
          </div>

          {/* Reset Progress Button */}
          {!showConfirmReset ? (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="flex items-center justify-center space-x-2 w-full py-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-xs hover:bg-rose-500/20 active:scale-95 transition"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Apagar Todo o Progresso</span>
            </button>
          ) : (
            /* Confirmation Warning Box */
            <div className="rounded-2xl bg-rose-500/15 p-3.5 border border-rose-500/40 text-center animate-fade-in">
              <div className="flex items-center justify-center space-x-1.5 text-rose-300 font-bold text-xs mb-1">
                <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                <span>Tem certeza absoluta?</span>
              </div>
              <p className="text-[11px] text-slate-300 mb-3">
                Suas moedas, estrelas e fases salvas serão apagadas permanentemente.
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700 hover:bg-slate-750"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setShowConfirmReset(false);
                    onResetProgress();
                  }}
                  className="flex-1 py-2 rounded-xl bg-rose-600 text-white font-black text-xs shadow-md hover:bg-rose-700"
                >
                  Sim, Apagar
                </button>
              </div>
            </div>
          )}

        </div>

        {/* App Version Info */}
        <p className="text-[10px] text-slate-500 font-mono">Caça-Palavras Brasil v1.0 • Built with AI Studio</p>

      </div>
    </div>
  );
};
