export type ThemeId = 
  | 'animais' 
  | 'frutas' 
  | 'paises' 
  | 'profissoes' 
  | 'futebol' 
  | 'comida' 
  | 'astronomia' 
  | 'musica' 
  | 'natureza' 
  | 'tecnologia'
  | 'biblia'
  | 'cidades'
  | 'novelas'
  | 'marcas';

export interface ThemeInfo {
  id: ThemeId;
  name: string;
  icon: string;
  color: string;
  gradient: string;
  isPremium?: boolean;
}

export interface PremiumPackInfo {
  id: ThemeId;
  name: string;
  icon: string;
  description: string;
  coinPrice: number;
  realPriceText: string;
  sampleWords: string[];
}

export interface LevelConfig {
  id: number;
  themeId: ThemeId;
  themeName: string;
  gridSize: number; // 8 to 12
  words: string[];
  allowDiagonal: boolean;
  allowBackward: boolean;
  timeLimitSeconds?: number; // Optional target time for 3 stars
}

export interface WordPlacement {
  word: string; // Original normalized word
  displayWord: string; // Word as shown in list (e.g. with accents if needed)
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
  found: boolean;
  color: string; // Unique color hex/class assigned when found
  hintedFirstLetter?: boolean;
}

export interface BoardCell {
  row: number;
  col: number;
  letter: string;
  color?: string; // Color assigned when word is found
  isPartOfFoundWord?: boolean;
  isHinted?: boolean;
}

export interface SelectionCell {
  row: number;
  col: number;
}

export interface SavedInProgress {
  grid: BoardCell[][];
  placements: WordPlacement[];
  timerSeconds: number;
  hintsUsed: number;
  levelConfig: LevelConfig;
}

export interface LevelProgress {
  levelId: number;
  completed: boolean;
  stars: number; // 1 to 3
  bestTimeSeconds?: number;
  inProgress?: SavedInProgress;
}

export interface DailyStreakData {
  lastCompletedDate: string; // YYYY-MM-DD
  currentStreak: number; // 0 to 7
  claimHistory: string[];
}

export interface PlayerData {
  coins: number;
  unlockedLevel: number;
  levelProgress: Record<number, LevelProgress>;
  hintsCount: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  isAdFree: boolean;
  hasSeenTutorial: boolean;
  levelsCompletedCount: number;
  dailyStreak: DailyStreakData;
  unlockedThemes: string[];
}
