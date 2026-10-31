/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { BoardCell, LevelConfig, PlayerData, ThemeId, WordPlacement } from './types/game';
import { LEVELS, THEMES, getRandomWordsForTheme } from './data/levels';
import { generateBoard } from './utils/wordSearchGenerator';
import { soundManager } from './utils/audio';
import { loadPlayerData, savePlayerData, resetPlayerData } from './utils/storage';
import { showRewardedAd, showInterstitial, registerAdListener, unregisterAdListener, AdRequest } from './utils/ads';
import {
  getDailyThemeId,
  getTodayDateString,
  calculateNextStreak,
  DAILY_REWARDS,
} from './utils/dailyChallenge';

import { TitleScreen } from './components/TitleScreen';
import { Header } from './components/Header';
import { GridBoard } from './components/GridBoard';
import { WordList } from './components/WordList';
import { PowerupsBar } from './components/PowerupsBar';
import { VictoryModal } from './components/VictoryModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { TutorialModal } from './components/TutorialModal';
import { SettingsModal } from './components/SettingsModal';
import { PauseModal } from './components/PauseModal';
import { AdModal } from './components/AdModal';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { DailyRewardClaimModal } from './components/DailyRewardClaimModal';
import { ShopModal } from './components/ShopModal';

export default function App() {
  // Player Data & Settings State
  const [playerData, setPlayerData] = useState<PlayerData>(loadPlayerData);

  // App Navigation View
  const [currentView, setCurrentView] = useState<'title' | 'playing' | 'level_select'>('title');

  // Gameplay State
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [currentLevelConfig, setCurrentLevelConfig] = useState<LevelConfig>(LEVELS[0]);
  const [grid, setGrid] = useState<BoardCell[][]>([]);
  const [placements, setPlacements] = useState<WordPlacement[]>([]);
  const [hintedCell, setHintedCell] = useState<{ row: number; col: number } | null>(null);

  // Gameplay Timer & Modals
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [hintsUsedInLevel, setHintsUsedInLevel] = useState<number>(0);

  // Daily Challenge state
  const [isDailyChallengeActive, setIsDailyChallengeActive] = useState<boolean>(false);
  const [showDailyChallengeModal, setShowDailyChallengeModal] = useState<boolean>(false);
  const [showDailyRewardClaimModal, setShowDailyRewardClaimModal] = useState<boolean>(false);
  const [pendingStreakDay, setPendingStreakDay] = useState<number>(1);

  // Shop state
  const [showShopModal, setShowShopModal] = useState<boolean>(false);

  // Pause state
  const [showPauseModal, setShowPauseModal] = useState<boolean>(false);

  // Modals visibility
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);
  const [victoryStats, setVictoryStats] = useState<{
    stars: number;
    coinsEarned: number;
    timeTaken: number;
    isDoubled: boolean;
  }>({ stars: 3, coinsEarned: 50, timeTaken: 0, isDoubled: false });

  const [showTutorialModal, setShowTutorialModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [adRequest, setAdRequest] = useState<AdRequest | null>(null);

  // Keep soundManager synced with playerData
  useEffect(() => {
    soundManager.enabled = playerData.soundEnabled;
    soundManager.vibrationEnabled = playerData.vibrationEnabled;
  }, [playerData.soundEnabled, playerData.vibrationEnabled]);

  // Register AdMob listener
  useEffect(() => {
    registerAdListener((req) => setAdRequest(req));
    return () => unregisterAdListener();
  }, []);

  // Timer interval effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (
      isTimerRunning &&
      !showPauseModal &&
      !showVictoryModal &&
      !showSettingsModal &&
      !showTutorialModal &&
      !showDailyChallengeModal &&
      !showDailyRewardClaimModal &&
      !showShopModal &&
      !adRequest
    ) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isTimerRunning,
    showPauseModal,
    showVictoryModal,
    showSettingsModal,
    showTutorialModal,
    showDailyChallengeModal,
    showDailyRewardClaimModal,
    showShopModal,
    adRequest,
  ]);

  // Track last used words per theme to prevent immediate repetition
  const [lastUsedWordsByTheme, setLastUsedWordsByTheme] = useState<Record<string, string[]>>({});

  // Save Player Data helper
  const updatePlayerData = useCallback((updater: (prev: PlayerData) => PlayerData) => {
    setPlayerData((prev) => {
      const next = updater(prev);
      savePlayerData(next);
      return next;
    });
  }, []);

  // Load a Standard Level
  const loadLevel = useCallback(
    (levelId: number) => {
      const config = LEVELS.find((l) => l.id === levelId) || LEVELS[0];
      const prevWords = lastUsedWordsByTheme[config.themeId] || [];
      const selectedWords = getRandomWordsForTheme(config.themeId, prevWords);

      const { grid: boardGrid, placements: wordPlacements } = generateBoard(config, selectedWords);

      setLastUsedWordsByTheme((prev) => ({
        ...prev,
        [config.themeId]: selectedWords,
      }));

      setCurrentLevelId(levelId);
      setCurrentLevelConfig({
        ...config,
        words: selectedWords,
      });
      setGrid(boardGrid);
      setPlacements(wordPlacements);
      setHintedCell(null);
      setTimerSeconds(0);
      setIsTimerRunning(true);
      setHintsUsedInLevel(0);
      setIsDailyChallengeActive(false);
      setShowPauseModal(false);
      setShowVictoryModal(false);
      setCurrentView('playing');
    },
    [lastUsedWordsByTheme]
  );

  // Quick Random Level Generator mode
  const loadQuickRandomLevel = useCallback(() => {
    const availableThemes = playerData.unlockedThemes as ThemeId[];
    const randomThemeId = availableThemes[Math.floor(Math.random() * availableThemes.length)] || 'animais';
    const themeInfo = THEMES[randomThemeId] || THEMES.animais;
    const prevWords = lastUsedWordsByTheme[randomThemeId] || [];
    const selectedWords = getRandomWordsForTheme(randomThemeId, prevWords);

    const randomLevelConfig: LevelConfig = {
      id: 999,
      themeId: randomThemeId,
      themeName: `Jogo Rápido - ${themeInfo.name}`,
      gridSize: 10,
      words: selectedWords,
      allowDiagonal: true,
      allowBackward: true,
      timeLimitSeconds: 150,
    };

    const { grid: boardGrid, placements: wordPlacements } = generateBoard(randomLevelConfig, selectedWords);

    setLastUsedWordsByTheme((prev) => ({
      ...prev,
      [randomThemeId]: selectedWords,
    }));

    setCurrentLevelId(999);
    setCurrentLevelConfig(randomLevelConfig);
    setGrid(boardGrid);
    setPlacements(wordPlacements);
    setHintedCell(null);
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setHintsUsedInLevel(0);
    setIsDailyChallengeActive(false);
    setShowPauseModal(false);
    setShowVictoryModal(false);
    setCurrentView('playing');
  }, [lastUsedWordsByTheme, playerData.unlockedThemes]);

  // Load Specific Unlocked Theme Game
  const loadThemeGame = useCallback(
    (themeId: ThemeId) => {
      const themeInfo = THEMES[themeId] || THEMES.animais;
      const prevWords = lastUsedWordsByTheme[themeId] || [];
      const selectedWords = getRandomWordsForTheme(themeId, prevWords);

      const customConfig: LevelConfig = {
        id: 777,
        themeId,
        themeName: `Especial - ${themeInfo.name}`,
        gridSize: 10,
        words: selectedWords,
        allowDiagonal: true,
        allowBackward: true,
        timeLimitSeconds: 150,
      };

      const { grid: boardGrid, placements: wordPlacements } = generateBoard(customConfig, selectedWords);

      setLastUsedWordsByTheme((prev) => ({
        ...prev,
        [themeId]: selectedWords,
      }));

      setCurrentLevelId(777);
      setCurrentLevelConfig(customConfig);
      setGrid(boardGrid);
      setPlacements(wordPlacements);
      setHintedCell(null);
      setTimerSeconds(0);
      setIsTimerRunning(true);
      setHintsUsedInLevel(0);
      setIsDailyChallengeActive(false);
      setShowPauseModal(false);
      setShowVictoryModal(false);
      setCurrentView('playing');
    },
    [lastUsedWordsByTheme]
  );

  // Load Daily Challenge
  const loadDailyChallenge = useCallback(() => {
    const dailyThemeId = getDailyThemeId();
    const themeInfo = THEMES[dailyThemeId] || THEMES.animais;
    const prevWords = lastUsedWordsByTheme[dailyThemeId] || [];
    const selectedWords = getRandomWordsForTheme(dailyThemeId, prevWords);

    const streakDay = calculateNextStreak(
      playerData.dailyStreak.lastCompletedDate,
      playerData.dailyStreak.currentStreak
    );

    const dailyConfig: LevelConfig = {
      id: 888,
      themeId: dailyThemeId,
      themeName: `Desafio Diário (Dia ${streakDay}) - ${themeInfo.name}`,
      gridSize: 10,
      words: selectedWords,
      allowDiagonal: true,
      allowBackward: true,
      timeLimitSeconds: 150,
    };

    const { grid: boardGrid, placements: wordPlacements } = generateBoard(dailyConfig, selectedWords);

    setLastUsedWordsByTheme((prev) => ({
      ...prev,
      [dailyThemeId]: selectedWords,
    }));

    setCurrentLevelId(888);
    setCurrentLevelConfig(dailyConfig);
    setGrid(boardGrid);
    setPlacements(wordPlacements);
    setHintedCell(null);
    setTimerSeconds(0);
    setIsTimerRunning(true);
    setHintsUsedInLevel(0);
    setIsDailyChallengeActive(true);
    setShowPauseModal(false);
    setShowDailyChallengeModal(false);
    setShowVictoryModal(false);
    setCurrentView('playing');
  }, [lastUsedWordsByTheme, playerData.dailyStreak]);

  // Shop Actions
  const handleUnlockThemeWithCoins = (themeId: string, coinPrice: number) => {
    updatePlayerData((prev) => ({
      ...prev,
      coins: prev.coins - coinPrice,
      unlockedThemes: Array.from(new Set([...prev.unlockedThemes, themeId])),
    }));
  };

  const handleUnlockThemeWithPurchase = (themeId: string) => {
    alert('Compra realizada com sucesso! O pacote de temas foi desbloqueado.');
    updatePlayerData((prev) => ({
      ...prev,
      unlockedThemes: Array.from(new Set([...prev.unlockedThemes, themeId])),
    }));
  };

  // Check Level Completion
  const checkLevelCompletion = useCallback(
    (updatedPlacements: WordPlacement[]) => {
      const allFound = updatedPlacements.every((p) => p.found);
      if (allFound) {
        setIsTimerRunning(false);

        // Daily Challenge Flow
        if (isDailyChallengeActive) {
          const streakDay = calculateNextStreak(
            playerData.dailyStreak.lastCompletedDate,
            playerData.dailyStreak.currentStreak
          );
          setPendingStreakDay(streakDay);
          setShowDailyRewardClaimModal(true);
          return;
        }

        // Standard Level Completion Flow
        let stars = 1;
        const targetTime = currentLevelConfig.timeLimitSeconds || 120;
        if (timerSeconds <= targetTime) stars++;
        if (hintsUsedInLevel === 0) stars++;

        const baseCoins = 50 + (stars === 3 ? 25 : 0);

        setVictoryStats({
          stars,
          coinsEarned: baseCoins,
          timeTaken: timerSeconds,
          isDoubled: false,
        });

        updatePlayerData((prev) => {
          const nextLevelToUnlock =
            currentLevelId < 777 && currentLevelId >= prev.unlockedLevel
              ? currentLevelId + 1
              : prev.unlockedLevel;

          const prevProgress = prev.levelProgress[currentLevelId];
          const bestTime = prevProgress?.bestTimeSeconds
            ? Math.min(prevProgress.bestTimeSeconds, timerSeconds)
            : timerSeconds;
          const bestStars = prevProgress?.stars ? Math.max(prevProgress.stars, stars) : stars;

          const newCompletedCount = prev.levelsCompletedCount + 1;

          return {
            ...prev,
            coins: prev.coins + baseCoins,
            unlockedLevel: Math.min(nextLevelToUnlock, LEVELS.length),
            levelsCompletedCount: newCompletedCount,
            levelProgress: {
              ...prev.levelProgress,
              [currentLevelId]: {
                levelId: currentLevelId,
                completed: true,
                stars: bestStars,
                bestTimeSeconds: bestTime,
              },
            },
          };
        });

        setShowVictoryModal(true);

        // Interstitial Ad Trigger every 3 completed levels
        if (playerData.levelsCompletedCount > 0 && playerData.levelsCompletedCount % 3 === 0) {
          setTimeout(() => {
            showInterstitial({
              onClose: () => {},
              isAdFree: playerData.isAdFree,
            });
          }, 800);
        }
      }
    },
    [
      isDailyChallengeActive,
      currentLevelConfig,
      currentLevelId,
      hintsUsedInLevel,
      timerSeconds,
      playerData.dailyStreak,
      playerData.levelsCompletedCount,
      playerData.isAdFree,
      updatePlayerData,
    ]
  );

  // Claim Daily Challenge Reward
  const handleClaimDailyReward = () => {
    const todayStr = getTodayDateString();
    const rewardInfo = DAILY_REWARDS.find((r) => r.day === pendingStreakDay) || DAILY_REWARDS[0];

    updatePlayerData((prev) => ({
      ...prev,
      coins: prev.coins + rewardInfo.coins,
      hintsCount: prev.hintsCount + (rewardInfo.hintsBonus || 0),
      dailyStreak: {
        lastCompletedDate: todayStr,
        currentStreak: pendingStreakDay,
        claimHistory: [...prev.dailyStreak.claimHistory, todayStr],
      },
    }));

    setShowDailyRewardClaimModal(false);
    setIsDailyChallengeActive(false);
    setCurrentView('title');
  };

  // Handle Drag Word Selection
  const handleWordFound = (selectedCells: { row: number; col: number }[]) => {
    if (selectedCells.length < 2) return;

    const selectedLetters = selectedCells.map((c) => grid[c.row][c.col].letter).join('');
    const reversedLetters = selectedLetters.split('').reverse().join('');

    const matchedIndex = placements.findIndex(
      (p) => !p.found && (p.word === selectedLetters || p.word === reversedLetters)
    );

    if (matchedIndex !== -1) {
      soundManager.playWordFound();
      soundManager.triggerVibration([40, 30, 80]);

      const updatedPlacements = [...placements];
      updatedPlacements[matchedIndex] = {
        ...updatedPlacements[matchedIndex],
        found: true,
      };

      setPlacements(updatedPlacements);
      checkLevelCompletion(updatedPlacements);
    } else {
      soundManager.playError();
      soundManager.triggerVibration(60);
    }
  };

  // Selection Error
  const handleSelectionError = () => {
    soundManager.playError();
  };

  // Power-up: Hint 1st Letter (Costs 25 coins)
  const handleUseHintLetter = () => {
    const HINT_COST = 25;
    if (playerData.coins < HINT_COST) {
      alert('Moedas insuficientes! Assista a um vídeo para ganhar mais moedas.');
      return;
    }

    const unFoundWord = placements.find((p) => !p.found);
    if (!unFoundWord) return;

    soundManager.playHint();
    updatePlayerData((prev) => ({ ...prev, coins: prev.coins - HINT_COST }));
    setHintsUsedInLevel((prev) => prev + 1);

    setHintedCell({ row: unFoundWord.startRow, col: unFoundWord.startCol });
    setTimeout(() => {
      setHintedCell(null);
    }, 4000);
  };

  // Power-up: Reveal Full Word (Costs 60 coins)
  const handleUseRevealWord = () => {
    const REVEAL_COST = 60;
    if (playerData.coins < REVEAL_COST) {
      alert('Moedas insuficientes! Assista a um vídeo para ganhar mais moedas.');
      return;
    }

    const unFoundIdx = placements.findIndex((p) => !p.found);
    if (unFoundIdx === -1) return;

    soundManager.playHint();
    soundManager.playWordFound();
    updatePlayerData((prev) => ({ ...prev, coins: prev.coins - REVEAL_COST }));
    setHintsUsedInLevel((prev) => prev + 1);

    const updated = [...placements];
    updated[unFoundIdx] = { ...updated[unFoundIdx], found: true };
    setPlacements(updated);

    checkLevelCompletion(updated);
  };

  // Ad Reward Handlers
  const handleWatchAdForHints = () => {
    showRewardedAd({
      rewardType: 'hints',
      onReward: () => {
        soundManager.playCoin();
        updatePlayerData((prev) => ({ ...prev, coins: prev.coins + 75 }));
      },
      isAdFree: playerData.isAdFree,
    });
  };

  const handleWatchAdForCoins = () => {
    showRewardedAd({
      rewardType: 'bonus_coins',
      onReward: () => {
        soundManager.playCoin();
        updatePlayerData((prev) => ({ ...prev, coins: prev.coins + 50 }));
      },
      isAdFree: playerData.isAdFree,
    });
  };

  const handleDoubleCoins = () => {
    showRewardedAd({
      rewardType: 'double_coins',
      onReward: () => {
        soundManager.playCoin();
        updatePlayerData((prev) => ({ ...prev, coins: prev.coins + victoryStats.coinsEarned }));
        setVictoryStats((prev) => ({ ...prev, isDoubled: true }));
      },
      isAdFree: playerData.isAdFree,
    });
  };

  // Remove Ads Purchase Mock
  const handleRemoveAds = () => {
    updatePlayerData((prev) => ({ ...prev, isAdFree: true }));
    alert('Anúncios removidos com sucesso! Obrigado pelo apoio.');
  };

  // Reset Progress
  const handleResetProgress = () => {
    const resetData = resetPlayerData();
    setPlayerData(resetData);
    setCurrentView('title');
    setShowSettingsModal(false);
  };

  // Toggle Sound
  const handleToggleSound = () => {
    updatePlayerData((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  // Toggle Vibration
  const handleToggleVibration = () => {
    updatePlayerData((prev) => ({ ...prev, vibrationEnabled: !prev.vibrationEnabled }));
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-900 text-white font-sans antialiased overflow-hidden flex flex-col justify-between">
      
      {/* 1. TITLE SCREEN VIEW */}
      {currentView === 'title' && (
        <TitleScreen
          playerData={playerData}
          onStartGame={() => loadLevel(playerData.unlockedLevel)}
          onOpenLevelSelect={() => setCurrentView('level_select')}
          onStartQuickGame={loadQuickRandomLevel}
          onOpenDailyChallenge={() => setShowDailyChallengeModal(true)}
          onOpenShop={() => setShowShopModal(true)}
          onToggleSound={handleToggleSound}
          onOpenTutorial={() => setShowTutorialModal(true)}
          onRemoveAds={handleRemoveAds}
          onWatchAdForCoins={handleWatchAdForCoins}
        />
      )}

      {/* 2. PLAYING VIEW */}
      {currentView === 'playing' && (
        <div className="relative h-[100dvh] max-h-[100dvh] w-full flex flex-col justify-between p-1.5 sm:p-2 overflow-hidden select-none">
          <Header
            levelNumber={currentLevelConfig.id}
            themeId={currentLevelConfig.themeId}
            themeName={currentLevelConfig.themeName}
            coins={playerData.coins}
            soundEnabled={playerData.soundEnabled}
            timerSeconds={timerSeconds}
            onBack={() => setCurrentView('title')}
            onPause={() => setShowPauseModal(true)}
            onToggleSound={handleToggleSound}
            onOpenSettings={() => setShowSettingsModal(true)}
            onWatchAdForCoins={handleWatchAdForCoins}
          />

          <GridBoard
            grid={grid}
            placements={placements}
            onWordFound={handleWordFound}
            onSelectionError={handleSelectionError}
            hintedCell={hintedCell}
          />

          <WordList placements={placements} />

          <PowerupsBar
            coins={playerData.coins}
            onUseHintLetter={handleUseHintLetter}
            onUseRevealWord={handleUseRevealWord}
            onWatchAdForHints={handleWatchAdForHints}
          />
        </div>
      )}

      {/* 3. LEVEL SELECT MODAL VIEW */}
      {currentView === 'level_select' && (
        <LevelSelectModal
          levels={LEVELS}
          playerData={playerData}
          onSelectLevel={(id) => loadLevel(id)}
          onClose={() => setCurrentView('title')}
        />
      )}

      {/* 4. SHOP MODAL VIEW */}
      {showShopModal && (
        <ShopModal
          playerData={playerData}
          onUnlockThemeWithCoins={handleUnlockThemeWithCoins}
          onUnlockThemeWithPurchase={handleUnlockThemeWithPurchase}
          onPlayTheme={(themeId) => loadThemeGame(themeId as ThemeId)}
          onClose={() => setShowShopModal(false)}
        />
      )}

      {/* 5. DAILY CHALLENGE MODAL */}
      {showDailyChallengeModal && (
        <DailyChallengeModal
          dailyStreak={playerData.dailyStreak}
          onStartDailyChallenge={loadDailyChallenge}
          onClose={() => setShowDailyChallengeModal(false)}
        />
      )}

      {/* 6. DAILY REWARD CLAIM MODAL */}
      {showDailyRewardClaimModal && (
        <DailyRewardClaimModal
          streakDay={pendingStreakDay}
          onClaim={handleClaimDailyReward}
        />
      )}

      {/* 7. PAUSE MODAL */}
      {showPauseModal && (
        <PauseModal
          levelNumber={currentLevelConfig.id}
          themeName={currentLevelConfig.themeName}
          onResume={() => setShowPauseModal(false)}
          onRestart={() => {
            setShowPauseModal(false);
            if (currentLevelId === 888) {
              loadDailyChallenge();
            } else if (currentLevelId === 999) {
              loadQuickRandomLevel();
            } else {
              loadLevel(currentLevelId);
            }
          }}
          onOpenSettings={() => {
            setShowPauseModal(false);
            setShowSettingsModal(true);
          }}
          onExitToMenu={() => {
            setShowPauseModal(false);
            setCurrentView('title');
          }}
        />
      )}

      {/* 8. VICTORY MODAL OVERLAY */}
      {showVictoryModal && (
        <VictoryModal
          levelNumber={currentLevelConfig.id}
          themeName={currentLevelConfig.themeName}
          starsCount={victoryStats.stars}
          coinsEarned={victoryStats.coinsEarned}
          timeTakenSeconds={victoryStats.timeTaken}
          isDoubledCoins={victoryStats.isDoubled}
          onNextLevel={() => loadLevel(currentLevelId + 1 > LEVELS.length ? 1 : currentLevelId + 1)}
          onReplayLevel={() => loadLevel(currentLevelId)}
          onDoubleCoins={handleDoubleCoins}
          onSelectLevel={() => {
            setShowVictoryModal(false);
            setCurrentView('level_select');
          }}
        />
      )}

      {/* 9. TUTORIAL MODAL */}
      {showTutorialModal && (
        <TutorialModal onClose={() => setShowTutorialModal(false)} />
      )}

      {/* 10. SETTINGS MODAL */}
      {showSettingsModal && (
        <SettingsModal
          soundEnabled={playerData.soundEnabled}
          vibrationEnabled={playerData.vibrationEnabled}
          isAdFree={playerData.isAdFree}
          onToggleSound={handleToggleSound}
          onToggleVibration={handleToggleVibration}
          onRemoveAds={handleRemoveAds}
          onResetProgress={handleResetProgress}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {/* 11. ADMOB SIMULATOR OVERLAY */}
      {adRequest && (
        <AdModal adRequest={adRequest} onClose={() => setAdRequest(null)} />
      )}

    </div>
  );
}
