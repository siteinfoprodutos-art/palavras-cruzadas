import React, { useState } from 'react';
import { usePWAInstall } from '../utils/usePWAInstall';
import { Download, Share, X, Smartphone } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed, don't show
  if (isInstalled) {
    return null;
  }

  // Android / Chromium / Desktop Install
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-indigo-600 font-extrabold text-white text-xs shadow-md hover:brightness-110 active:scale-95 transition"
      >
        <Download className="h-3.5 w-3.5 stroke-[3]" />
        <span>Instalar App</span>
      </button>
    );
  }

  // iOS Safari Install Guide
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-slate-800 border border-indigo-500/40 font-bold text-indigo-300 text-xs shadow-sm active:scale-95 transition"
        >
          <Smartphone className="h-3.5 w-3.5 text-indigo-400" />
          <span>Instalar no iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in text-center">
            <div className="relative w-full max-w-sm rounded-3xl bg-slate-850 p-6 text-slate-100 shadow-2xl border border-slate-700">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 mx-auto mb-3">
                <Share className="h-7 w-7 animate-bounce" />
              </div>

              <h3 className="text-lg font-black text-white">Instalar no iPhone / iPad</h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed text-left bg-slate-800 p-3 rounded-2xl border border-slate-700">
                1. Toque no botão de <strong>Compartilhar</strong> (ícone com quadrado e seta para cima) na barra do Safari.<br />
                2. Role para baixo e selecione <strong>Adicionar à Tela de Início</strong>.
              </p>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-2xl bg-indigo-600 py-3 text-xs font-black text-white hover:bg-indigo-500 transition"
              >
                Entendi
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
