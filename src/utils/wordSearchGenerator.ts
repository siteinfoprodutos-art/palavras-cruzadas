import { BoardCell, LevelConfig, WordPlacement } from '../types/game';
import { WORD_SEARCH_COLORS } from '../data/levels';

// Portuguese letter frequencies for natural-looking grid filling
const PT_BR_LETTER_POOL = 'AAAAAAEEEEEEOOOOOIIIIIUUUUUSSSSRRRRNNNNTTTTMMMMDDDDCCCCPPPPLLLLBBVVGGFFZJ';

export function normalizeWord(word: string): string {
  return word
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '');
}

interface Direction {
  dr: number;
  dc: number;
}

export function generateBoard(
  level: LevelConfig,
  customWords?: string[]
): {
  grid: BoardCell[][];
  placements: WordPlacement[];
} {
  const targetWords = customWords && customWords.length >= 10 ? customWords : level.words;

  // Prepare normalized words list
  const preparedWords = targetWords.map((w) => ({
    displayWord: w,
    norm: normalizeWord(w),
  }));

  // Find max word length
  const maxWordLen = Math.max(...preparedWords.map((w) => w.norm.length));

  // Minimum grid size must fit the longest word
  let currentSize = Math.max(level.gridSize, maxWordLen + 1, 9);

  // Available directions based on level config
  const directions: Direction[] = [
    { dr: 0, dc: 1 },  // Horizontal Right
    { dr: 1, dc: 0 },  // Vertical Down
  ];

  if (level.allowDiagonal) {
    directions.push({ dr: 1, dc: 1 });   // Diagonal Down-Right
    directions.push({ dr: -1, dc: 1 });  // Diagonal Up-Right
  }

  if (level.allowBackward) {
    directions.push({ dr: 0, dc: -1 });  // Horizontal Left
    directions.push({ dr: -1, dc: 0 });  // Vertical Up
    if (level.allowDiagonal) {
      directions.push({ dr: 1, dc: -1 });  // Diagonal Down-Left
      directions.push({ dr: -1, dc: -1 }); // Diagonal Up-Left
    }
  }

  let finalGridLetters: (string | null)[][] = [];
  let finalPlacements: WordPlacement[] = [];
  let boardGeneratedSuccess = false;

  // Global Retry Loop: If grid is too crowded, expand currentSize and retry
  for (let gridAttempt = 0; gridAttempt < 30 && !boardGeneratedSuccess; gridAttempt++) {
    const size = currentSize;

    // Try up to 50 random layouts for this currentSize
    for (let layoutAttempt = 0; layoutAttempt < 50; layoutAttempt++) {
      const gridLetters: (string | null)[][] = Array.from({ length: size }, () =>
        Array(size).fill(null)
      );

      // Sort words descending by length for optimal placement
      const sortedWords = [...preparedWords].sort((a, b) => b.norm.length - a.norm.length);
      const placements: WordPlacement[] = [];
      let allWordsPlaced = true;

      for (let idx = 0; idx < sortedWords.length; idx++) {
        const item = sortedWords[idx];
        const norm = item.norm;
        const len = norm.length;
        let placed = false;
        let attempts = 0;
        const maxAttempts = 400;

        while (!placed && attempts < maxAttempts) {
          attempts++;
          const dir = directions[Math.floor(Math.random() * directions.length)];

          // Calculate valid start ranges
          const minRow = dir.dr < 0 ? len - 1 : 0;
          const maxRow = dir.dr > 0 ? size - len : size - 1;
          const minCol = dir.dc < 0 ? len - 1 : 0;
          const maxCol = dir.dc > 0 ? size - len : size - 1;

          if (minRow > maxRow || minCol > maxCol) continue;

          const startRow = Math.floor(Math.random() * (maxRow - minRow + 1)) + minRow;
          const startCol = Math.floor(Math.random() * (maxCol - minCol + 1)) + minCol;

          // Check collision
          let canPlace = true;
          for (let i = 0; i < len; i++) {
            const r = startRow + dir.dr * i;
            const c = startCol + dir.dc * i;
            const currentCell = gridLetters[r][c];
            if (currentCell !== null && currentCell !== norm[i]) {
              canPlace = false;
              break;
            }
          }

          if (canPlace) {
            const endRow = startRow + dir.dr * (len - 1);
            const endCol = startCol + dir.dc * (len - 1);

            for (let i = 0; i < len; i++) {
              const r = startRow + dir.dr * i;
              const c = startCol + dir.dc * i;
              gridLetters[r][c] = norm[i];
            }

            const color = WORD_SEARCH_COLORS[placements.length % WORD_SEARCH_COLORS.length];
            placements.push({
              word: norm,
              displayWord: item.displayWord,
              startRow,
              startCol,
              endRow,
              endCol,
              found: false,
              color,
            });

            placed = true;
          }
        }

        if (!placed) {
          allWordsPlaced = false;
          break; // Try next layout attempt
        }
      }

      if (allWordsPlaced && placements.length === targetWords.length) {
        finalGridLetters = gridLetters;
        finalPlacements = placements;
        boardGeneratedSuccess = true;
        break;
      }
    }

    if (!boardGeneratedSuccess) {
      currentSize++; // Enlarge grid size by 1 if density was too high
    }
  }

  // Fill remaining empty cells with random Portuguese letters
  const grid: BoardCell[][] = [];
  const finalSize = finalGridLetters.length || currentSize;

  for (let r = 0; r < finalSize; r++) {
    const rowCells: BoardCell[] = [];
    for (let c = 0; c < finalSize; c++) {
      let letter = finalGridLetters[r]?.[c];
      if (!letter) {
        letter = PT_BR_LETTER_POOL[Math.floor(Math.random() * PT_BR_LETTER_POOL.length)];
      }
      rowCells.push({
        row: r,
        col: c,
        letter,
      });
    }
    grid.push(rowCells);
  }

  return { grid, placements: finalPlacements };
}

// Get cells along a line between start and end (if valid straight line)
export function getLineCells(
  r1: number,
  c1: number,
  r2: number,
  c2: number
): { row: number; col: number }[] {
  const dr = r2 - r1;
  const dc = c2 - c1;

  const absDr = Math.abs(dr);
  const absDc = Math.abs(dc);

  // Must be horizontal, vertical, or 45-deg diagonal
  if (dr !== 0 && dc !== 0 && absDr !== absDc) {
    return [];
  }

  const steps = Math.max(absDr, absDc);
  if (steps === 0) return [{ row: r1, col: c1 }];

  const stepR = dr === 0 ? 0 : dr / absDr;
  const stepC = dc === 0 ? 0 : dc / absDc;

  const cells: { row: number; col: number }[] = [];
  for (let i = 0; i <= steps; i++) {
    cells.push({
      row: r1 + stepR * i,
      col: c1 + stepC * i,
    });
  }

  return cells;
}

/**
 * Snap arbitrary target cell (r2, c2) to the nearest 8-way straight line from (r1, c1)
 */
export function snapToNearestLine(
  r1: number,
  c1: number,
  r2: number,
  c2: number,
  gridSize: number
): { row: number; col: number }[] {
  const dr = r2 - r1;
  const dc = c2 - c1;

  if (dr === 0 && dc === 0) {
    return [{ row: r1, col: c1 }];
  }

  // Calculate angle in radians
  const angle = Math.atan2(dr, dc); // [-PI, PI]
  
  // Snap angle to 8 sectors (step of PI/4 = 45 degrees)
  let sectorIndex = Math.round(angle / (Math.PI / 4));
  if (sectorIndex === -4) sectorIndex = 4;

  let stepR = 0;
  let stepC = 0;

  switch (sectorIndex) {
    case 0:  stepR = 0;  stepC = 1;  break; // Right
    case 1:  stepR = 1;  stepC = 1;  break; // Down-Right
    case 2:  stepR = 1;  stepC = 0;  break; // Down
    case 3:  stepR = 1;  stepC = -1; break; // Down-Left
    case 4:  stepR = 0;  stepC = -1; break; // Left
    case -3: stepR = -1; stepC = -1; break; // Up-Left
    case -2: stepR = -1; stepC = 0;  break; // Up
    case -1: stepR = -1; stepC = 1;  break; // Up-Right
    default: stepR = 0;  stepC = 1;  break;
  }

  // Calculate step distance based on maximum axis displacement
  const distance = Math.max(Math.abs(dr), Math.abs(dc));

  // Determine ideal target endpoint
  let targetR = r1 + stepR * distance;
  let targetC = c1 + stepC * distance;

  // Clamp endpoint within grid bounds while maintaining slope
  while (
    (targetR < 0 || targetR >= gridSize || targetC < 0 || targetC >= gridSize) &&
    (targetR !== r1 || targetC !== c1)
  ) {
    targetR -= stepR;
    targetC -= stepC;
  }

  return getLineCells(r1, c1, targetR, targetC);
}

