import React from 'react';
import { X, Touchpad, Lightbulb, Star, Coins } from 'lucide-react';

interface TutorialModalProps {
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-850 p-6 text-center shadow-2xl border border-slate-700">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="text-xl font-black text-white">Como Jogar Caça-Palavras</h2>
        <p className="mt-1 text-xs text-indigo-300">Aprenda a jogar em menos de 1 minuto!</p>

        {/* Steps Carousel / List */}
        <div className="my-5 flex flex-col space-y-3 text-left">
          
          {/* Step 1 */}
          <div className="flex items-start space-x-3 rounded-2xl bg-slate-800 p-3 border border-slate-700/80">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
              <Touchpad className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">1. Arraste para Selecionar</h3>
              <p className="mt-0.5 text-[11px] text-slate-300">
                Deslize o dedo sobre as letras na horizontal, vertical ou diagonal para marcar uma palavra.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start space-x-3 rounded-2xl bg-slate-800 p-3 border border-slate-700/80">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-slate-950 shadow-md">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">2. Use as Dicas</h3>
              <p className="mt-0.5 text-[11px] text-slate-300">
                Ficou preso? Use o botão de <strong>1ª Letra</strong> ou <strong>Revelar</strong> gastando suas moedas.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start space-x-3 rounded-2xl bg-slate-800 p-3 border border-slate-700/80">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-md">
              <Star className="h-5 w-5 fill-current" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white">3. Ganhe Estrelas & Moedas</h3>
              <p className="mt-0.5 text-[11px] text-slate-300">
                Encontre todas as palavras rapidamente para conquistar 3 estrelas e acumular muitas moedas!
              </p>
            </div>
          </div>

        </div>

        {/* Start / Close CTA */}
        <button
          onClick={onClose}
          className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 font-black text-white text-sm shadow-xl hover:brightness-110 active:scale-95 transition"
        >
          Entendi, Vamos Jogar!
        </button>

      </div>
    </div>
  );
};
