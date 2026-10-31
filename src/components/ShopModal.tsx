import React, { useState } from 'react';
import { PlayerData, PremiumPackInfo } from '../types/game';
import { PREMIUM_PACKS } from '../data/levels';
import { soundManager } from '../utils/audio';
import { X, Sparkles, Coins, Check, Eye, ShoppingBag, CreditCard } from 'lucide-react';

interface ShopModalProps {
  playerData: PlayerData;
  onUnlockThemeWithCoins: (themeId: string, coinPrice: number) => void;
  onUnlockThemeWithPurchase: (themeId: string) => void;
  onPlayTheme: (themeId: string) => void;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  playerData,
  onUnlockThemeWithCoins,
  onUnlockThemeWithPurchase,
  onPlayTheme,
  onClose,
}) => {
  const [selectedPreviewPack, setSelectedPreviewPack] = useState<PremiumPackInfo | null>(null);

  const isUnlocked = (themeId: string) => playerData.unlockedThemes.includes(themeId);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-900 text-white overflow-hidden animate-fade-in">
      
      {/* Top Header */}
      <header className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-850/90 backdrop-blur-md shrink-0">
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 text-slate-200 border border-slate-700 active:scale-95 transition"
          aria-label="Fechar Loja"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-2">
          <ShoppingBag className="h-5 w-5 text-amber-400" />
          <h1 className="text-lg font-black text-white">Loja de Temas Premium</h1>
        </div>

        {/* Coins Counter */}
        <div className="flex items-center space-x-1.5 bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 rounded-full text-amber-300 text-xs font-black">
          <Coins className="h-4 w-4 fill-amber-400/30" />
          <span>{playerData.coins}</span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 max-w-md mx-auto w-full">
        
        {/* Banner Notice */}
        <div className="mb-4 rounded-3xl bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-800/80 p-4 border border-purple-500/30 shadow-lg text-center">
          <div className="inline-flex items-center space-x-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-black text-amber-300 border border-amber-500/30 mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>PACOTES EXCLUSIVOS</span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Desbloqueie pacotes temáticos inéditos usando suas moedas ou por compra única!
          </p>
        </div>

        {/* Premium Packs List */}
        <div className="flex flex-col space-y-3.5">
          {PREMIUM_PACKS.map((pack) => {
            const unlocked = isUnlocked(pack.id);

            return (
              <div
                key={pack.id}
                className={`relative flex flex-col p-4 rounded-3xl border transition shadow-lg ${
                  unlocked
                    ? 'bg-slate-850/90 border-emerald-500/40'
                    : 'bg-slate-850 border-slate-700/80 hover:border-indigo-500/60'
                }`}
              >
                {/* Pack Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl p-2 rounded-2xl bg-slate-800 border border-slate-700/60 shadow-inner">
                      {pack.icon}
                    </span>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-black text-white">{pack.name}</h3>
                        <span className="text-[10px] font-black uppercase bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 px-2 py-0.5 rounded-full shadow-sm">
                          Premium
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                        {pack.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Preview Button */}
                <button
                  onClick={() => setSelectedPreviewPack(pack)}
                  className="mt-3 inline-flex items-center justify-center space-x-1.5 text-xs font-bold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 py-1.5 px-3 rounded-xl transition self-start"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Ver Prévia das Palavras</span>
                </button>

                {/* Bottom Action Area */}
                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
                  {unlocked ? (
                    <div className="flex items-center justify-between w-full">
                      <span className="flex items-center space-x-1 text-xs font-black text-emerald-400 bg-emerald-500/15 px-3 py-1.5 rounded-full border border-emerald-500/30">
                        <Check className="h-4 w-4 stroke-[3]" />
                        <span>Pacote Desbloqueado!</span>
                      </span>

                      <button
                        onClick={() => {
                          onPlayTheme(pack.id);
                          onClose();
                        }}
                        className="py-1.5 px-4 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs shadow-md hover:brightness-110 transition"
                      >
                        Jogar Agora
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2 w-full">
                      {/* Unlock with Coins */}
                      <button
                        onClick={() => {
                          if (playerData.coins >= pack.coinPrice) {
                            soundManager.playCoin();
                            onUnlockThemeWithCoins(pack.id, pack.coinPrice);
                          } else {
                            alert('Moedas insuficientes! Assista a um vídeo para ganhar mais moedas.');
                          }
                        }}
                        className={`flex-1 flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-2xl border font-black text-xs transition active:scale-95 shadow-md ${
                          playerData.coins >= pack.coinPrice
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-500'
                        }`}
                      >
                        <Coins className="h-4 w-4 text-amber-400 fill-amber-400/30" />
                        <span>Desbloquear ({pack.coinPrice})</span>
                      </button>

                      {/* Unlock with In-App Purchase Placeholder */}
                      <button
                        onClick={() => onUnlockThemeWithPurchase(pack.id)}
                        className="flex items-center justify-center space-x-1 py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 font-extrabold text-white text-xs shadow-md hover:brightness-110 active:scale-95 transition shrink-0"
                      >
                        <CreditCard className="h-3.5 w-3.5" />
                        <span>{pack.realPriceText}</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Word Preview Modal Overlay */}
      {selectedPreviewPack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm rounded-3xl bg-slate-850 p-6 text-center shadow-2xl border border-slate-700">
            
            <button
              onClick={() => setSelectedPreviewPack(null)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center justify-center space-x-2 text-2xl mb-1">
              <span>{selectedPreviewPack.icon}</span>
              <h3 className="text-xl font-black text-white">{selectedPreviewPack.name}</h3>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Amostra de palavras incluídas neste pacote Premium:
            </p>

            {/* Word Chips Grid */}
            <div className="flex flex-wrap justify-center gap-2 p-3 rounded-2xl bg-slate-800 border border-slate-700/80 mb-5">
              {selectedPreviewPack.sampleWords.map((word, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-slate-700/80 border border-slate-600/60 text-indigo-300 font-black text-xs shadow-sm"
                >
                  {word}
                </span>
              ))}
            </div>

            {/* Unlock CTA inside preview */}
            {!isUnlocked(selectedPreviewPack.id) ? (
              <button
                onClick={() => {
                  if (playerData.coins >= selectedPreviewPack.coinPrice) {
                    soundManager.playCoin();
                    onUnlockThemeWithCoins(selectedPreviewPack.id, selectedPreviewPack.coinPrice);
                    setSelectedPreviewPack(null);
                  } else {
                    alert('Moedas insuficientes!');
                  }
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 font-black text-slate-950 text-sm shadow-xl hover:brightness-110 active:scale-95 transition"
              >
                Desbloquear por {selectedPreviewPack.coinPrice} Moedas
              </button>
            ) : (
              <div className="py-2.5 text-xs font-black text-emerald-400 bg-emerald-500/15 rounded-xl border border-emerald-500/30">
                ✨ Pacote Já Desbloqueado!
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
