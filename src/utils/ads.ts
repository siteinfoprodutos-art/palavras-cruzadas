/**
 * AdMob Integration Module Placeholder.
 * In a native mobile or web app with real Google AdMob / AdSense SDK,
 * replace the internal mock triggers below with actual SDK calls:
 * e.g., google.admob.rewarded.show() or AdMob.showInterstitial().
 */

export type AdType = 'rewarded' | 'interstitial';

export interface AdRequest {
  type: AdType;
  title: string;
  description: string;
  rewardText?: string;
  durationSeconds: number;
  onReward?: () => void;
  onClose: () => void;
}

type AdListener = (request: AdRequest | null) => void;
let currentAdListener: AdListener | null = null;

export function registerAdListener(listener: AdListener) {
  currentAdListener = listener;
}

export function unregisterAdListener() {
  currentAdListener = null;
}

/**
 * Funçao isolada para exibir Anúncio Recompensado (Rewarded Ad)
 * Pode ser chamada em qualquer lugar do app para conceder dicas, moedas ou bônus.
 */
export function showRewardedAd(options: {
  rewardType: 'hints' | 'double_coins' | 'bonus_coins';
  onReward: () => void;
  onClose?: () => void;
  isAdFree?: boolean;
}) {
  // Se o jogador comprou "Remover Anúncios", concede a recompensa imediatamente sem exibir anúncio!
  if (options.isAdFree) {
    options.onReward();
    if (options.onClose) options.onClose();
    return;
  }

  let title = 'Assistindo Anúncio...';
  let description = 'Aguarde alguns segundos para receber sua recompensa.';
  let rewardText = '+3 Dicas Grátis!';

  if (options.rewardType === 'double_coins') {
    title = 'Anúncio Recompensado';
    description = 'Assista até o fim para dobrar as moedas desta fase!';
    rewardText = 'Dobro de Moedas!';
  } else if (options.rewardType === 'bonus_coins') {
    title = 'Anúncio Recompensado';
    description = 'Assista ao vídeo para receber 50 Moedas Bônus!';
    rewardText = '+50 Moedas!';
  }

  if (currentAdListener) {
    currentAdListener({
      type: 'rewarded',
      title,
      description,
      rewardText,
      durationSeconds: 5,
      onReward: options.onReward,
      onClose: () => {
        if (options.onClose) options.onClose();
        if (currentAdListener) currentAdListener(null);
      },
    });
  } else {
    // Fallback se nenhum listener estiver ativo
    options.onReward();
    if (options.onClose) options.onClose();
  }
}

/**
 * Função isolada para exibir Anúncio Intersticial (Interstitial Ad)
 * Chamada a cada 3 fases concluídas.
 */
export function showInterstitial(options: {
  onClose: () => void;
  isAdFree?: boolean;
}) {
  // Se comprou Remover Anúncios, não exibe
  if (options.isAdFree) {
    options.onClose();
    return;
  }

  if (currentAdListener) {
    currentAdListener({
      type: 'interstitial',
      title: 'Anúncio Patrocinado',
      description: 'Obrigado por jogar Caça-Palavras Brasil!',
      durationSeconds: 3,
      onClose: () => {
        options.onClose();
        if (currentAdListener) currentAdListener(null);
      },
    });
  } else {
    options.onClose();
  }
}
