import React, { useState, useRef, useEffect, useCallback } from 'react';
import { BoardCell, WordPlacement } from '../types/game';
import { getLineCells, snapToNearestLine } from '../utils/wordSearchGenerator';
import { soundManager } from '../utils/audio';

interface GridBoardProps {
  grid: BoardCell[][];
  placements: WordPlacement[];
  onWordFound: (selectedCells: { row: number; col: number }[]) => void;
  onSelectionError: () => void;
  hintedCell?: { row: number; col: number } | null;
}

export const GridBoard: React.FC<GridBoardProps> = ({
  grid,
  placements,
  onWordFound,
  onSelectionError,
  hintedCell,
}) => {
  const gridSize = grid.length;
  const boardRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startCell, setStartCell] = useState<{ row: number; col: number } | null>(null);
  const [currentCell, setCurrentCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedLineCells, setSelectedLineCells] = useState<{ row: number; col: number }[]>([]);

  // Find cell index from touch or pointer client coordinates
  const getCellFromCoords = useCallback(
    (clientX: number, clientY: number): { row: number; col: number } | null => {
      if (!boardRef.current) return null;
      const rect = boardRef.current.getBoundingClientRect();

      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const cellWidth = rect.width / gridSize;
      const cellHeight = rect.height / gridSize;

      const col = Math.floor(x / cellWidth);
      const row = Math.floor(y / cellHeight);

      // Clamp coordinates to board boundaries
      const clampedRow = Math.max(0, Math.min(gridSize - 1, row));
      const clampedCol = Math.max(0, Math.min(gridSize - 1, col));

      return { row: clampedRow, col: clampedCol };
    },
    [gridSize]
  );

  const startDrag = useCallback(
    (clientX: number, clientY: number) => {
      const cell = getCellFromCoords(clientX, clientY);
      if (!cell) return;

      soundManager.playTap();
      soundManager.triggerVibration(20);

      setIsDragging(true);
      setStartCell(cell);
      setCurrentCell(cell);
      setSelectedLineCells([cell]);
    },
    [getCellFromCoords]
  );

  const updateDrag = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging || !startCell) return;

      const cell = getCellFromCoords(clientX, clientY);
      if (!cell) return;

      if (!currentCell || cell.row !== currentCell.row || cell.col !== currentCell.col) {
        setCurrentCell(cell);

        // Snap to nearest 8-way straight line (accepts slightly crooked drags)
        const line = snapToNearestLine(startCell.row, startCell.col, cell.row, cell.col, gridSize);
        if (line.length > 0) {
          if (line.length !== selectedLineCells.length) {
            soundManager.playTap();
            soundManager.triggerVibration(10);
          }
          setSelectedLineCells(line);
        }
      }
    },
    [isDragging, startCell, currentCell, getCellFromCoords, gridSize, selectedLineCells.length]
  );

  const endDrag = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    if (selectedLineCells.length >= 2) {
      onWordFound(selectedLineCells);
    } else {
      onSelectionError();
    }

    setStartCell(null);
    setCurrentCell(null);
    setSelectedLineCells([]);
  }, [isDragging, selectedLineCells, onWordFound, onSelectionError]);

  // Non-passive Touch Event Listeners to prevent scroll, zoom, and native selection
  useEffect(() => {
    const boardEl = boardRef.current;
    if (!boardEl) return;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        updateDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      endDrag();
    };

    boardEl.addEventListener('touchstart', handleTouchStart, { passive: false });
    boardEl.addEventListener('touchmove', handleTouchMove, { passive: false });
    boardEl.addEventListener('touchend', handleTouchEnd, { passive: false });
    boardEl.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    return () => {
      boardEl.removeEventListener('touchstart', handleTouchStart);
      boardEl.removeEventListener('touchmove', handleTouchMove);
      boardEl.removeEventListener('touchend', handleTouchEnd);
      boardEl.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [startDrag, updateDrag, endDrag]);

  // Global window pointerup catch
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (isDragging) {
        endDrag();
      }
    };
    window.addEventListener('pointerup', handleGlobalPointerUp);
    return () => window.removeEventListener('pointerup', handleGlobalPointerUp);
  }, [isDragging, endDrag]);

  // Pointer Handlers for Mouse / Pointer devices
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    if (!isDragging) return;
    e.preventDefault();
    updateDrag(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    e.preventDefault();
    endDrag();
  };

  // Create cell color map for found words
  const foundCellColorMap: Record<string, string> = {};
  placements.forEach((p) => {
    if (p.found) {
      const line = getLineCells(p.startRow, p.startCol, p.endRow, p.endCol);
      line.forEach(({ row, col }) => {
        foundCellColorMap[`${row}-${col}`] = p.color;
      });
    }
  });

  // Selected cell set for quick lookup
  const selectedSet = new Set(selectedLineCells.map((c) => `${c.row}-${c.col}`));

  // Active selection line coordinates for SVG capsule track overlay
  const selStart = selectedLineCells.length > 0 ? selectedLineCells[0] : null;
  const selEnd = selectedLineCells.length > 0 ? selectedLineCells[selectedLineCells.length - 1] : null;

  const getCellCenterPercent = (row: number, col: number) => ({
    x: ((col + 0.5) / gridSize) * 100,
    y: ((row + 0.5) / gridSize) * 100,
  });

  const capsuleStrokeWidth = (100 / gridSize) * 0.76;

  return (
    <div className="w-full flex-1 min-h-0 flex items-center justify-center my-0.5 px-2">
      <div
        ref={boardRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative grid aspect-square rounded-2xl sm:rounded-3xl bg-slate-850 p-1.5 sm:p-2.5 shadow-2xl border-2 border-slate-700/80 touch-none select-none overflow-hidden"
        style={{
          width: 'min(100%, 380px)',
          height: 'min(100%, 380px)',
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
          gap: gridSize >= 11 ? '2px' : '3px',
        }}
      >
        {/* SVG Rounded Capsule Tracks Overlay */}
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none z-10 p-1.5 sm:p-2.5"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Found Words Persistent Capsules */}
          {placements.map((p, idx) => {
            if (!p.found) return null;
            const p1 = getCellCenterPercent(p.startRow, p.startCol);
            const p2 = getCellCenterPercent(p.endRow, p.endCol);
            return (
              <g key={idx}>
                {/* Outer Glow Capsule */}
                <line
                  x1={`${p1.x}%`}
                  y1={`${p1.y}%`}
                  x2={`${p2.x}%`}
                  y2={`${p2.y}%`}
                  stroke={p.color}
                  strokeWidth={`${capsuleStrokeWidth}%`}
                  strokeLinecap="round"
                  opacity="0.85"
                />
              </g>
            );
          })}

          {/* Active Dragging Rounded Capsule Track */}
          {selStart && selEnd && (
            <g>
              {/* Semi-transparent Wide Outer Glow */}
              <line
                x1={`${getCellCenterPercent(selStart.row, selStart.col).x}%`}
                y1={`${getCellCenterPercent(selStart.row, selStart.col).y}%`}
                x2={`${getCellCenterPercent(selEnd.row, selEnd.col).x}%`}
                y2={`${getCellCenterPercent(selEnd.row, selEnd.col).y}%`}
                stroke="#6366f1"
                strokeWidth={`${capsuleStrokeWidth * 1.05}%`}
                strokeLinecap="round"
                opacity="0.5"
              />
              {/* Bright Core Capsule Track */}
              <line
                x1={`${getCellCenterPercent(selStart.row, selStart.col).x}%`}
                y1={`${getCellCenterPercent(selStart.row, selStart.col).y}%`}
                x2={`${getCellCenterPercent(selEnd.row, selEnd.col).x}%`}
                y2={`${getCellCenterPercent(selEnd.row, selEnd.col).y}%`}
                stroke="#818cf8"
                strokeWidth={`${capsuleStrokeWidth * 0.75}%`}
                strokeLinecap="round"
                opacity="0.9"
              />
            </g>
          )}
        </svg>

        {/* Render Grid Cells */}
        {grid.map((rowCells, r) =>
          rowCells.map((cell, c) => {
            const key = `${r}-${c}`;
            const isSelected = selectedSet.has(key);
            const foundColor = foundCellColorMap[key];
            const isHinted = hintedCell && hintedCell.row === r && hintedCell.col === c;

            // Responsive font sizing based on grid size
            const fontSizeClass =
              gridSize <= 8
                ? 'text-base sm:text-2xl font-black'
                : gridSize <= 10
                ? 'text-xs sm:text-xl font-extrabold'
                : 'text-[10px] sm:text-lg font-bold';

            return (
              <div
                key={key}
                className={`relative flex items-center justify-center rounded-2xl transition-all duration-100 select-none ${fontSizeClass} ${
                  isSelected
                    ? 'text-white font-black scale-105 z-20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]'
                    : foundColor
                    ? 'text-white font-black z-20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]'
                    : isHinted
                    ? 'bg-amber-500/30 text-amber-300 border-2 border-amber-400 animate-pulse z-20'
                    : 'bg-slate-800/90 text-slate-100 border border-slate-700/40 z-0'
                }`}
              >
                <span className="relative z-30">{cell.letter}</span>

                {/* Pulsing Hint Badge */}
                {isHinted && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3 z-40">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
