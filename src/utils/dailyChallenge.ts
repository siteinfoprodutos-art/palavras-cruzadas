import { ThemeId } from '../types/game';
import { THEMES } from '../data/levels';

export interface DailyReward {
  day: number;
  coins: number;
  hintsBonus?: number;
  isChest?: boolean;
}

export const DAILY_REWARDS: DailyReward[] = [
  { day: 1, coins: 50 },
  { day: 2, coins: 75 },
  { day: 3, coins: 100 },
  { day: 4, coins: 125 },
  { day: 5, coins: 150 },
  { day: 6, coins: 200 },
  { day: 7, coins: 500, hintsBonus: 3, isChest: true },
];

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDailyThemeId(dateStr: string = getTodayDateString()): ThemeId {
  const themeIds: ThemeId[] = [
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

  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash += dateStr.charCodeAt(i) * (i + 1);
  }

  const index = Math.abs(hash) % themeIds.length;
  return themeIds[index];
}

export function isDailyChallengeCompletedToday(lastCompletedDate: string): boolean {
  return lastCompletedDate === getTodayDateString();
}

export function calculateNextStreak(lastCompletedDate: string, currentStreak: number): number {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  if (lastCompletedDate === today) {
    return currentStreak > 0 ? currentStreak : 1;
  }

  if (lastCompletedDate === yesterday) {
    return currentStreak >= 7 ? 1 : currentStreak + 1;
  }

  // Missed days or first time starting
  return 1;
}

export function getTimeUntilMidnight(): { hours: number; minutes: number; seconds: number; formatted: string } {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);

  const diffMs = Math.max(0, midnight.getTime() - now.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formatted = `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;

  return { hours, minutes, seconds, formatted };
}
