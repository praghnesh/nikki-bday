import React, { useState, useEffect } from "react";
import { Timer, Trophy, RotateCcw, Play, Heart, ArrowRight } from "lucide-react";
import { nikkiPhotos } from "../data/memories";
import { sound } from "../utils/audioSynth";
import { triggerConfetti, triggerGrandFireworks } from "../utils/confetti";

const LEVELS = [
  { level: 1, target: 8, interval: 700, title: "Level 1: Peek-A-Boo Nikki 🐰" },
  { level: 2, target: 14, interval: 550, title: "Level 2: Bunny Hop Rush 🐾" },
  { level: 3, target: 20, interval: 420, title: "Level 3: Queen's Whack Jubilee 👑" },
];

export default function WhackAMole({ onScoreUpdate, unlockAchievement, onLevelComplete }) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [activeHoles, setActiveHoles] = useState([]);
  const [whackedCount, setWhackedCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [levelWon, setLevelWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const lvlConfig = LEVELS[currentLevel - 1] || LEVELS[0];

  const startLevel = (lvl = currentLevel) => {
    sound.playSparkle();
    setCurrentLevel(lvl);
    setWhackedCount(0);
    setTimeLeft(30);
    setLevelWon(false);
    setGameOver(false);
    setActiveHoles([]);
    setIsPlaying(true);
  };

  // 30s Countdown timer
  useEffect(() => {
    if (!isPlaying) return;
    if (timeLeft <= 0) {
      setIsPlaying(false);
      setActiveHoles([]);

      if (whackedCount >= lvlConfig.target) {
        setLevelWon(true);
        sound.playSuccessFanfare();
        triggerGrandFireworks(2500);

        if (currentLevel === 3 && unlockAchievement) {
          unlockAchievement("bop_master");
        }
      } else {
        setGameOver(true);
        sound.playWhack();
      }

      if (onScoreUpdate) onScoreUpdate(whackedCount * 10);
      return;
    }

    const t = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(t);
  }, [isPlaying, timeLeft, whackedCount, lvlConfig]);

  // Mole pop-up interval
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      const count = Math.random() > 0.65 ? 2 : 1;
      const newActive = [];
      for (let i = 0; i < count; i++) {
        const holeIdx = Math.floor(Math.random() * 9);
        const photoObj = nikkiPhotos[Math.floor(Math.random() * nikkiPhotos.length)];
        if (!newActive.some((a) => a.idx === holeIdx)) {
          newActive.push({ idx: holeIdx, photo: photoObj.url, label: photoObj.label, id: Math.random() });
        }
      }
      setActiveHoles(newActive);
    }, lvlConfig.interval);

    return () => clearInterval(interval);
  }, [isPlaying, lvlConfig]);

  const handleWhack = (holeIdx) => {
    if (!isPlaying) return;
    const target = activeHoles.find((a) => a.idx === holeIdx);
    if (target) {
      sound.playWhack();
      const next = whackedCount + 1;
      setWhackedCount(next);
      setActiveHoles((prev) => prev.filter((a) => a.idx !== holeIdx));

      // Level clear early check
      if (next >= lvlConfig.target) {
        setIsPlaying(false);
        setActiveHoles([]);
        setLevelWon(true);
        sound.playSuccessFanfare();
        triggerGrandFireworks(2500);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto p-4 sm:p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-pink-200 dark:border-pink-900/60 shadow-xl">
      {/* Top Bar with Level, Target & 30s Timer */}
      <div className="w-full flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 text-xs font-bold">
            Level {currentLevel} of 3
          </span>
          <span className="text-xs sm:text-sm font-bold text-pink-600 dark:text-pink-300">
            Caught: {whackedCount} / {lvlConfig.target} 🐾
          </span>
        </div>

        {/* 30 Seconds Timer */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
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

      {/* 3x3 Grid of Burrows */}
      <div className="relative grid grid-cols-3 gap-3 w-64 h-64 sm:w-80 sm:h-80 select-none">
        {Array.from({ length: 9 }).map((_, index) => {
          const activeItem = activeHoles.find((a) => a.idx === index);
          return (
            <div
              key={index}
              onClick={() => handleWhack(index)}
              className="relative rounded-2xl bg-gradient-to-b from-pink-100 to-purple-100 dark:from-slate-800 dark:to-slate-800/80 border-2 border-pink-200 dark:border-pink-800/60 overflow-hidden flex items-end justify-center cursor-pointer shadow-inner"
            >
              <div className="absolute bottom-2 w-14 sm:w-16 h-4 bg-pink-300/40 dark:bg-purple-900/50 rounded-full" />

              {/* Popping Cute Character / Nikki photo */}
              {activeItem && isPlaying && (
                <div className="absolute bottom-2 flex flex-col items-center animate-bounce-subtle hover:scale-110 transition-transform">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-white shadow-lg bg-white">
                    <img
                      src={activeItem.photo}
                      alt="Nikki"
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-pink-600 dark:text-pink-300 bg-white/90 px-1.5 py-0.2 rounded-full -mt-1 shadow-xs">
                    Tap!
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {/* Start / Level Clear / Game Over Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-white/85 dark:bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center rounded-2xl z-20">
            {levelWon ? (
              <>
                <div className="text-4xl mb-2">🎉 🐰 👑</div>
                <h4 className="font-display font-bold text-2xl text-slate-800 dark:text-white mb-1">
                  Level {currentLevel} Cleared!
                </h4>
                <p className="text-xs sm:text-sm text-pink-600 dark:text-pink-300 font-semibold mb-4">
                  You caught {whackedCount} cuties in under 30 seconds!
                </p>
                <button
                  onClick={onLevelComplete || (() => {
                    if (currentLevel < 3) startLevel(currentLevel + 1);
                    else startLevel(1);
                  })}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-glow-pink hover:scale-105 transition cursor-pointer"
                >
                  <span>
                    {onLevelComplete ? "Proceed to Level 4 (Candy Catch) 🚀" : currentLevel < 3 ? `Proceed to Level ${currentLevel + 1} 🚀` : "Replay Level 1 🔄"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : gameOver ? (
              <>
                <div className="text-4xl mb-2">⏳</div>
                <h4 className="font-display font-bold text-xl text-slate-800 dark:text-white mb-1">
                  30 Seconds Up!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
                  You caught {whackedCount} of required {lvlConfig.target}.
                </p>
                <button
                  onClick={() => startLevel(currentLevel)}
                  className="px-6 py-2.5 rounded-full font-bold text-xs text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 transition shadow-glow-pink cursor-pointer"
                >
                  Try Level {currentLevel} Again
                </button>
              </>
            ) : (
              <>
                <div className="text-4xl mb-2">🐰 🐾 ✨</div>
                <h4 className="font-display font-bold text-xl text-slate-800 dark:text-white mb-1">
                  {lvlConfig.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mb-4">
                  Tap {lvlConfig.target} popping cuties before the 30-second timer runs out!
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

      <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
        Tap cute popping cuties quickly to beat the 30-second timer!
      </div>
    </div>
  );
}
