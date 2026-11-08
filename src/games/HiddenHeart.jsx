import React, { useState, useEffect } from "react";
import { Timer, Heart, RotateCcw, Trophy, Sparkles, Check, ArrowRight } from "lucide-react";
import { sound } from "../utils/audioSynth";
import { triggerConfetti, triggerGrandFireworks } from "../utils/confetti";

const ALL_HEARTS = [
  { id: 1, x: 18, y: 32, size: 22, level: 1 },
  { id: 2, x: 78, y: 22, size: 20, level: 1 },
  { id: 3, x: 48, y: 55, size: 24, level: 1 },
  { id: 4, x: 28, y: 80, size: 20, level: 1 },
  { id: 5, x: 86, y: 72, size: 18, level: 2 },
  { id: 6, x: 62, y: 38, size: 18, level: 2 },
  { id: 7, x: 38, y: 20, size: 16, level: 3 },
  { id: 8, x: 74, y: 82, size: 16, level: 3 },
];

const LEVEL_CONFIGS = [
  { level: 1, count: 4, title: "Level 1: Garden Stroll (Find 4 Hearts in 30s)" },
  { level: 2, count: 6, title: "Level 2: Fairy Meadow (Find 6 Hearts in 30s)" },
  { level: 3, count: 8, title: "Level 3: Enchanted Realm (Find 8 Hearts in 30s)" },
];

export default function HiddenHeart({ onScoreUpdate, unlockAchievement, onLevelComplete }) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [foundIds, setFoundIds] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [levelWon, setLevelWon] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const lvlConfig = LEVEL_CONFIGS[currentLevel - 1] || LEVEL_CONFIGS[0];
  const activeHearts = ALL_HEARTS.slice(0, lvlConfig.count);

  const startLevel = (lvl = currentLevel) => {
    sound.playSparkle();
    setCurrentLevel(lvl);
    setFoundIds(new Set());
    setTimeLeft(30);
    setLevelWon(false);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  // 30 Seconds Countdown Timer
  useEffect(() => {
    if (!isPlaying) return;
    if (timeLeft <= 0) {
      setIsGameOver(true);
      setIsPlaying(false);
      sound.playWhack();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const handleHeartClick = (heart) => {
    if (!isPlaying || foundIds.has(heart.id)) return;

    sound.playChime();
    const nextFound = new Set(foundIds);
    nextFound.add(heart.id);
    setFoundIds(nextFound);

    if (nextFound.size === activeHearts.length) {
      // Level Cleared!
      setTimeout(() => {
        setIsPlaying(false);
        setLevelWon(true);
        sound.playSuccessFanfare();
        triggerGrandFireworks(2500);

        if (currentLevel === 3 && unlockAchievement) {
          unlockAchievement("enter_universe");
        }
        if (onScoreUpdate) onScoreUpdate(currentLevel * 30);
      }, 300);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4 sm:p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-pink-200 dark:border-pink-900/60 shadow-xl">
      {/* Top Bar with Level, Target & 30s Timer */}
      <div className="w-full flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 text-xs font-bold">
            Level {currentLevel} of 3
          </span>
          <div className="text-xs sm:text-sm font-bold text-pink-600 dark:text-pink-300 flex items-center gap-1">
            <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
            <span>Found: {foundIds.size} / {activeHearts.length}</span>
          </div>
        </div>

        {/* 30 Seconds Timer */}
        <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
          <Timer className="w-4 h-4 text-purple-500" />
          <span>{timeLeft}s</span>
        </div>

        <button
          onClick={() => startLevel(currentLevel)}
          className="p-1.5 rounded-full hover:bg-pink-100 dark:hover:bg-slate-800 text-pink-600 dark:text-pink-300 transition cursor-pointer"
          title="Restart Level"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Illustrated Enchanted Scene Canvas */}
      <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border-2 border-pink-200 dark:border-pink-800/80 select-none shadow-inner bg-gradient-to-b from-sky-200 via-pink-100 to-emerald-100 dark:from-slate-800 dark:via-purple-950/40 dark:to-slate-900">
        <div className="absolute top-6 left-10 text-4xl opacity-75">☁️</div>
        <div className="absolute top-10 right-12 text-3xl opacity-75">☁️</div>
        <div className="absolute top-4 right-1/3 text-4xl animate-pulse">☀️</div>

        <div className="absolute bottom-12 left-4 text-5xl">🌸</div>
        <div className="absolute bottom-16 left-14 text-4xl">🌺</div>
        <div className="absolute bottom-10 right-8 text-5xl">🍄</div>
        <div className="absolute bottom-20 right-20 text-3xl">☕</div>

        {/* Central Birthday Tea Table & Cake */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <div className="text-5xl animate-bounce-subtle">🎂</div>
          <div className="w-36 h-6 bg-pink-300 dark:bg-purple-900 rounded-full shadow-md mt-1" />
        </div>

        {/* Hidden Hearts for Current Level */}
        {activeHearts.map((h) => {
          const isFound = foundIds.has(h.id);
          return (
            <div
              key={h.id}
              onClick={() => handleHeartClick(h)}
              className={`absolute cursor-pointer transition-all duration-300 -translate-x-1/2 -translate-y-1/2 ${
                isFound
                  ? "scale-150 animate-pulse text-pink-500 fill-pink-500 filter drop-shadow-lg z-20"
                  : "opacity-45 hover:opacity-100 hover:scale-125 z-10"
              }`}
              style={{
                left: `${h.x}%`,
                top: `${h.y}%`,
              }}
            >
              {isFound ? (
                <div className="relative">
                  <span className="text-xl">💖</span>
                  <span className="absolute -top-3 -right-2 text-[10px]">✨</span>
                </div>
              ) : (
                <span
                  className="inline-block text-pink-300 dark:text-pink-400 select-none"
                  style={{ fontSize: `${h.size}px` }}
                >
                  💗
                </span>
              )}
            </div>
          );
        })}

        {/* Overlays */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-white/85 dark:bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-30">
            {levelWon ? (
              <>
                <div className="text-4xl mb-2">🎉 💗 👑</div>
                <h3 className="font-display font-bold text-2xl text-slate-800 dark:text-white mb-1">
                  Level {currentLevel} Cleared!
                </h3>
                <p className="text-xs sm:text-sm text-pink-600 dark:text-pink-300 font-semibold mb-4">
                  You spotted all {activeHearts.length} hearts in under 30 seconds!
                </p>
                <button
                  onClick={onLevelComplete || (() => {
                    if (currentLevel < 3) startLevel(currentLevel + 1);
                    else startLevel(1);
                  })}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 transition shadow-glow-pink cursor-pointer"
                >
                  <span>
                    {onLevelComplete ? "Proceed to Level 6 (Guess Word) 🚀" : currentLevel < 3 ? `Advance to Level ${currentLevel + 1} 🚀` : "Replay Level 1 🔄"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : isGameOver ? (
              <>
                <div className="text-4xl mb-2">⏳</div>
                <h3 className="font-display font-bold text-xl text-slate-800 dark:text-white mb-1">
                  30 Seconds Up!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
                  You found {foundIds.size} of {activeHearts.length} hearts.
                </p>
                <button
                  onClick={() => startLevel(currentLevel)}
                  className="px-6 py-2.5 rounded-full font-bold text-xs text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 transition cursor-pointer shadow-glow-pink"
                >
                  Try Level {currentLevel} Again
                </button>
              </>
            ) : (
              <>
                <div className="text-5xl mb-3 animate-pulse">💗🔍✨</div>
                <h3 className="font-display font-bold text-2xl text-slate-800 dark:text-white mb-1">
                  {lvlConfig.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xs mb-4">
                  Find and tap all {activeHearts.length} hidden hearts before the 30-second timer runs out!
                </p>
                <button
                  onClick={() => startLevel(currentLevel)}
                  className="px-8 py-3.5 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 transition shadow-glow-pink cursor-pointer"
                >
                  Start Level {currentLevel} (30s) ✨
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 text-center">
        💡 Tip: Check around the flower bushes, tea table, mushroom, and clouds!
      </div>
    </div>
  );
}
