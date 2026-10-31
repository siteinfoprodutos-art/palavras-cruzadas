import React, { useState, useEffect } from 'react';
import { AdRequest } from '../utils/ads';
import { Play, CheckCircle2, X } from 'lucide-react';

interface AdModalProps {
  adRequest: AdRequest | null;
  onClose: () => void;
}

export const AdModal: React.FC<AdModalProps> = ({ adRequest, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(5);
  const [canClose, setCanClose] = useState(false);
  const [rewardGranted, setRewardGranted] = useState(false);

  useEffect(() => {
    if (!adRequest) return;

    setTimeLeft(adRequest.durationSeconds);
    setCanClose(false);
    setRewardGranted(false);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanClose(true);
          if (adRequest.type === 'rewarded' && adRequest.onReward) {
            adRequest.onReward();
            setRewardGranted(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [adRequest]);

  if (!adRequest) return null;

  const progressPercent = ((adRequest.durationSeconds - timeLeft) / adRequest.durationSeconds) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-800 p-6 text-center shadow-2xl border border-slate-700">
        
        {/* Top Header Badge */}
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          {canClose ? (
            <button
              onClick={() => {
                adRequest.onClose();
                onClose();
              }}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-white hover:bg-slate-600 transition"
              aria-label="Fechar Anúncio"
            >
              <X className="h-5 w-5" />
            </button>
          ) : (
            <div className="flex h-9 items-center rounded-full bg-slate-700/80 px-3 text-xs font-semibold text-slate-300">
              Anúncio em {timeLeft}s
            </div>
          )}
        </div>

        {/* Ad Provider Banner Mock */}
        <div className="mt-2 inline-flex items-center space-x-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
          <Play className="h-3 w-3 fill-current" />
          <span>Google Mobile Ads / AdMob Placeholder</span>
        </div>

        {/* Center Ad Visual Frame */}
        <div className="my-6 flex h-48 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-900/60 to-purple-900/60 p-4 border border-indigo-500/20 shadow-inner">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-3xl shadow-lg animate-bounce">
            🎬
          </div>
          <h3 className="mt-3 text-lg font-bold text-white">{adRequest.title}</h3>
          <p className="mt-1 text-xs text-slate-300 max-w-[220px]">{adRequest.description}</p>
        </div>

        {/* Progress Bar */}
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-indigo-500 transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Reward Status Notice */}
        {adRequest.type === 'rewarded' && (
          <div className="mt-4 min-h-[40px] flex items-center justify-center">
            {rewardGranted ? (
              <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm bg-emerald-500/10 py-1.5 px-4 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="h-4 w-4" />
                <span>Recompensa Concedida: {adRequest.rewardText}!</span>
              </div>
            ) : (
              <p className="text-xs text-amber-400 font-medium">
                Assista até o final para ganhar {adRequest.rewardText}
              </p>
            )}
          </div>
        )}

        {/* Action Button */}
        {canClose && (
          <button
            onClick={() => {
              adRequest.onClose();
              onClose();
            }}
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition"
          >
            Continuar
          </button>
        )}
      </div>
    </div>
  );
};
