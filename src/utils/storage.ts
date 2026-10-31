import { PlayerData } from '../types/game';

const STORAGE_KEY = 'caca_palavras_brasil_player_data';

const DEFAULT_UNLOCKED_THEMES = [
  'animais',
  'frutas',
  'paises',
  'profissoes',
  'futebol',
  'comida',
  'astronomia',
  'musica',
  'natureza',
  'tecnologia',
];

const DEFAULT_PLAYER_DATA: PlayerData = {
  coins: 100,
  unlockedLevel: 1,
  levelProgress: {},
  hintsCount: 3,
  soundEnabled: true,
  vibrationEnabled: true,
  isAdFree: false,
  hasSeenTutorial: false,
  levelsCompletedCount: 0,
  dailyStreak: {
    lastCompletedDate: '',
    currentStreak: 0,
    claimHistory: [],
  },
  unlockedThemes: DEFAULT_UNLOCKED_THEMES,
};

export function loadPlayerData(): PlayerData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PLAYER_DATA;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PLAYER_DATA,
      ...parsed,
      levelProgress: parsed.levelProgress || {},
      dailyStreak: {
        ...DEFAULT_PLAYER_DATA.dailyStreak,
        ...(parsed.dailyStreak || {}),
      },
      unlockedThemes: Array.isArray(parsed.unlockedThemes)
        ? Array.from(new Set([...DEFAULT_UNLOCKED_THEMES, ...parsed.unlockedThemes]))
        : DEFAULT_UNLOCKED_THEMES,
    };
  } catch (err) {
    console.error('Error loading player data:', err);
    return DEFAULT_PLAYER_DATA;
  }
}

export function savePlayerData(data: PlayerData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving player data:', err);
  }
}

export function resetPlayerData(): PlayerData {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error resetting player data:', err);
  }
  return DEFAULT_PLAYER_DATA;
}
