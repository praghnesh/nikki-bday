import React, { useState, useEffect, useRef } from "react";
import { Timer, Trophy, RotateCcw, Heart, Play, ArrowLeft, ArrowRight } from "lucide-react";
import { sound } from "../utils/audioSynth";
import { triggerConfetti, triggerGrandFireworks } from "../utils/confetti";

const LEVELS = [
  { level: 1, target: 70, speedMin: 2.0, speedMax: 3.2, spawnInterval: 520, title: "Level 1: Sweet Drizzle 🍬" },
  { level: 2, target: 130, speedMin: 2.7, speedMax: 4.2, spawnInterval: 420, title: "Level 2: Pastry Shower 🧁" },
  { level: 3, target: 190, speedMin: 3.5, speedMax: 5.2, spawnInterval: 320, title: "Level 3: Sugar Rush Jubilee 🍓" },
];

const CANDY_TYPES = [
  { icon: "🍬", pts: 10, isBad: false },
  { icon: "🧁", pts: 15, isBad: false },
  { icon: "🍓", pts: 10, isBad: false },
  { icon: "🍩", pts: 20, isBad: false },
  { icon: "🎁", pts: 30, isBad: false },
  { icon: "⛈️", pts: -15, isBad: true },
];

export default function CandyCatch({ onScoreUpdate, unlockAchievement, onLevelComplete }) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [levelWon, setLevelWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [trayX, setTrayX] = useState(50);
  const [fallingItems, setFallingItems] = useState([]);

  const containerRef = useRef(null);
  const moveIntervalRef = useRef(null);
  const lvlConfig = LEVELS[currentLevel - 1] || LEVELS[0];

  const startMoving = (direction) => {
    if (!isPlaying) return;
    setTrayX((x) => (direction === "left" ? Math.max(8, x - 7) : Math.min(92, x + 7)));

    if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
    moveIntervalRef.current = setInterval(() => {
      setTrayX((x) => (direction === "left" ? Math.max(8, x - 4) : Math.min(92, x + 4)));
    }, 40);
  };

  const stopMoving = () => {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (!isPlaying) stopMoving();
    return () => stopMoving();
  }, [isPlaying]);

  const startLevel = (lvl = currentLevel) => {
    sound.playSparkle();
    setCurrentLevel(lvl);
    setScore(0);
    setTimeLeft(30);
    setLevelWon(false);
    setGameOver(false);
    setFallingItems([]);
    setIsPlaying(true);
  };

  // 30s Countdown timer
  useEffect(() => {
    if (!isPlaying) return;
    if (timeLeft <= 0) {
      setIsPlaying(false);

      if (score >= lvlConfig.target) {
        setLevelWon(true);
        sound.playSuccessFanfare();
        triggerGrandFireworks(2500);

        if (currentLevel === 3 && unlockAchievement) {
          unlockAchievement("sweet_catcher");
        }
      } else {
        setGameOver(true);
        sound.playWhack();
      }

      if (onScoreUpdate) onScoreUpdate(score);
      return;
    }

    const t = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(t);
  }, [isPlaying, timeLeft, score, lvlConfig]);

  // Spawn candies
  useEffect(() => {
    if (!isPlaying) return;
    const spawnTimer = setInterval(() => {
      const type = CANDY_TYPES[Math.floor(Math.random() * CANDY_TYPES.length)];
      const newItem = {
        id: Date.now() + Math.random(),
        x: 8 + Math.random() * 84,
        y: 0,
        speed: lvlConfig.speedMin + Math.random() * (lvlConfig.speedMax - lvlConfig.speedMin),
        ...type,
      };
      setFallingItems((prev) => [...prev, newItem]);
    }, lvlConfig.spawnInterval);

    return () => clearInterval(spawnTimer);
  }, [isPlaying, lvlConfig]);

  // Animation Loop & Collision
  useEffect(() => {
    if (!isPlaying) return;
    let animId;

    const loop = () => {
      setFallingItems((prevItems) => {
        const next = [];
        for (const item of prevItems) {
          const nextY = item.y + item.speed;

          if (nextY >= 80 && nextY <= 90 && Math.abs(item.x - trayX) < 14) {
            if (item.isBad) {
              sound.playWhack();
            } else {
              sound.playChime();
            }
            setScore((s) => Math.max(0, s + item.pts));
            continue;
          }

          if (nextY > 100) continue;
          next.push({ ...item, y: nextY });
        }
        return next;
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, trayX]);

  const handlePointerMove = (e) => {
    if (!isPlaying || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    if (!clientX) return;
    const relX = ((clientX - rect.left) / rect.width) * 100;
    setTrayX(Math.max(8, Math.min(92, relX)));
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto p-4 sm:p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-pink-200 dark:border-pink-900/60 shadow-xl">
      {/* Top Bar with Level, Target & 30s Timer */}
      <div className="w-full flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 text-xs font-bold">
            Level {currentLevel} of 3
          </span>
          <div className="text-xs sm:text-sm font-bold text-pink-600 dark:text-pink-300">
            Score: {score} / {lvlConfig.target}
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

      {/* Falling Catch Area */}
      <div
        ref={containerRef}
        onMouseMove={handlePointerMove}
        onTouchMove={handlePointerMove}
        className="relative w-full h-80 sm:h-96 rounded-2xl bg-gradient-to-b from-amber-50 via-pink-50 to-purple-50 dark:from-slate-800 dark:via-purple-950/20 dark:to-slate-800 border-2 border-dashed border-pink-200 dark:border-pink-800/60 overflow-hidden select-none cursor-ew-resize"
      >
        {isPlaying &&
          fallingItems.map((item) => (
            <div
              key={item.id}
              className="absolute text-2xl sm:text-3xl filter drop-shadow -translate-x-1/2"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              {item.icon}
            </div>
          ))}

        {/* Player Dessert Plate */}
        <div
          className="absolute bottom-3 -translate-x-1/2 flex flex-col items-center transition-all duration-75"
          style={{ left: `${trayX}%` }}
        >
          <div className="px-4 py-1 bg-gradient-to-r from-amber-400 to-rose-400 text-white rounded-full text-xs font-bold shadow-md border-2 border-white flex items-center gap-1">
            <span>🍰 Nikki's Tray</span>
          </div>
          <div className="w-16 h-3 bg-pink-300/30 rounded-full blur-sm mt-1" />
        </div>

        {/* Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-white/85 dark:bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
            {levelWon ? (
              <>
                <div className="text-4xl mb-2">🧁 🎉 🍓</div>
                <h4 className="font-display font-bold text-2xl text-slate-800 dark:text-white mb-1">
                  Level {currentLevel} Cleared!
                </h4>
                <p className="text-xs sm:text-sm text-pink-600 dark:text-pink-300 font-semibold mb-4">
                  You gathered {score} points in under 30 seconds!
                </p>
                <button
                  onClick={onLevelComplete || (() => {
                    if (currentLevel < 3) startLevel(currentLevel + 1);
                    else startLevel(1);
                  })}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-glow-pink hover:scale-105 transition cursor-pointer"
                >
                  <span>
                    {onLevelComplete ? "Proceed to Level 5 (Hidden Hearts) 🚀" : currentLevel < 3 ? `Advance to Level ${currentLevel + 1} 🚀` : "Replay Level 1 🔄"}
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
                  You scored {score} of required {lvlConfig.target} points.
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
                <div className="text-4xl mb-2">🍬 🧁 🍓</div>
                <h4 className="font-display font-bold text-xl text-slate-800 dark:text-white mb-1">
                  {lvlConfig.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mb-4">
                  Catch falling sweets to reach {lvlConfig.target} points in 30 seconds! Dodge storm clouds!
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

      {/* Mobile & Touch Left / Right Control Buttons */}
      <div className="w-full flex items-center justify-between gap-3 mt-4">
        <button
          onMouseDown={() => startMoving("left")}
          onMouseUp={stopMoving}
          onMouseLeave={stopMoving}
          onTouchStart={(e) => {
            e.preventDefault();
            startMoving("left");
          }}
          onTouchEnd={stopMoving}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-pink-500/25 active:scale-95 transition-all select-none touch-manipulation cursor-pointer border border-pink-300 dark:border-pink-800"
          aria-label="Move tray left"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          <span>MOVE LEFT</span>
        </button>

        <button
          onMouseDown={() => startMoving("right")}
          onMouseUp={stopMoving}
          onMouseLeave={stopMoving}
          onTouchStart={(e) => {
            e.preventDefault();
            startMoving("right");
          }}
          onTouchEnd={stopMoving}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-purple-500/25 active:scale-95 transition-all select-none touch-manipulation cursor-pointer border border-purple-300 dark:border-purple-800"
          aria-label="Move tray right"
        >
          <span>MOVE RIGHT</span>
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 text-center flex items-center justify-center gap-1">
        <span>📱 Mobile: Tap or hold buttons • 💻 PC: Arrow keys or mouse</span>
      </p>

      <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex-wrap">
        <span>🍬 (+10)</span>
        <span>🧁 (+15)</span>
        <span>🎁 (+30)</span>
        <span className="text-rose-500">⛈️ Storm (-15)</span>
      </div>
    </div>
  );
}
