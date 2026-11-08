import React, { useState, useEffect, useRef } from "react";
import { Play, RotateCcw, Heart, Trophy, Timer, Award, ArrowRight } from "lucide-react";
import { sound } from "../utils/audioSynth";
import { triggerConfetti, triggerGrandFireworks } from "../utils/confetti";

const LEVELS = [
  { level: 1, target: 60, speedMin: 2.0, speedMax: 3.2, spawnInterval: 600, label: "Level 1: Sweet Breeze" },
  { level: 2, target: 120, speedMin: 2.8, speedMax: 4.2, spawnInterval: 480, label: "Level 2: Golden Shower" },
  { level: 3, target: 180, speedMin: 3.6, speedMax: 5.4, spawnInterval: 380, label: "Level 3: Cupid's Whirlwind" },
];

export default function CatchHearts({ onScoreUpdate, unlockAchievement, onLevelComplete }) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [levelWon, setLevelWon] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("nikki_catch_hearts_high") || "0", 10);
  });

  const [basketX, setBasketX] = useState(50); // percentage 0 - 100
  const [items, setItems] = useState([]);
  const containerRef = useRef(null);
  const moveIntervalRef = useRef(null);

  const startMoving = (direction) => {
    if (!isPlaying) return;
    // Immediate step
    setBasketX((x) => (direction === "left" ? Math.max(8, x - 7) : Math.min(92, x + 7)));

    // Continuous movement when pressed and held
    if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
    moveIntervalRef.current = setInterval(() => {
      setBasketX((x) => (direction === "left" ? Math.max(8, x - 4) : Math.min(92, x + 4)));
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

  const lvlConfig = LEVELS[currentLevel - 1] || LEVELS[0];

  // Item types
  const types = [
    { type: "heart", icon: "❤️", pts: 10, weight: 60 },
    { type: "golden", icon: "💛", pts: 25, weight: 20 },
    { type: "broken", icon: "💔", pts: -10, weight: 15 },
    { type: "star", icon: "⭐", pts: 50, weight: 5 },
  ];

  const startLevel = (lvl = currentLevel) => {
    sound.playSparkle();
    setCurrentLevel(lvl);
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setLevelWon(false);
    setItems([]);
    setIsPlaying(true);
  };

  // 30s Timer countdown
  useEffect(() => {
    if (!isPlaying) return;
    if (timeLeft <= 0) {
      setIsPlaying(false);

      if (score >= lvlConfig.target) {
        // Cleared level!
        setLevelWon(true);
        sound.playSuccessFanfare();
        triggerGrandFireworks(2500);

        if (currentLevel === 3 && unlockAchievement) {
          unlockAchievement("catch_hearts_champion");
        }
      } else {
        // Failed
        setGameOver(true);
        sound.playWhack();
      }

      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("nikki_catch_hearts_high", String(score));
      }
      if (onScoreUpdate) onScoreUpdate(score);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, score, lvlConfig]);

  // Spawning falling items
  useEffect(() => {
    if (!isPlaying) return;
    const spawnTimer = setInterval(() => {
      const roll = Math.random() * 100;
      let selectedType = types[0];
      let acc = 0;
      for (const t of types) {
        acc += t.weight;
        if (roll <= acc) {
          selectedType = t;
          break;
        }
      }

      const newItem = {
        id: Date.now() + Math.random(),
        x: 8 + Math.random() * 84,
        y: 0,
        speed: lvlConfig.speedMin + Math.random() * (lvlConfig.speedMax - lvlConfig.speedMin),
        ...selectedType,
      };

      setItems((prev) => [...prev, newItem]);
    }, lvlConfig.spawnInterval);

    return () => clearInterval(spawnTimer);
  }, [isPlaying, lvlConfig]);

  // Game animation loop
  useEffect(() => {
    if (!isPlaying) return;
    let animId;

    const updateLoop = () => {
      setItems((prevItems) => {
        const nextItems = [];
        for (const item of prevItems) {
          const nextY = item.y + item.speed;

          // Check collision with basket
          if (nextY >= 82 && nextY <= 92 && Math.abs(item.x - basketX) < 14) {
            if (item.pts > 0) {
              sound.playChime();
            } else {
              sound.playWhack();
            }
            setScore((s) => Math.max(0, s + item.pts));
            continue;
          }

          if (nextY > 100) continue;
          nextItems.push({ ...item, y: nextY });
        }
        return nextItems;
      });

      animId = requestAnimationFrame(updateLoop);
    };

    animId = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, basketX]);

  // Handle Controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isPlaying) return;
      if (e.key === "ArrowLeft") {
        setBasketX((x) => Math.max(8, x - 6));
      } else if (e.key === "ArrowRight") {
        setBasketX((x) => Math.min(92, x + 6));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying]);

  const handlePointerMove = (e) => {
    if (!isPlaying || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    if (!clientX) return;
    const relX = ((clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(8, Math.min(92, relX)));
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4 sm:p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-pink-200 dark:border-pink-900/60 shadow-xl">
      {/* Top Status Bar with Level, Target and 30s Timer */}
      <div className="w-full flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 text-xs font-bold">
            Level {currentLevel} of 3
          </span>
          <div className="text-xs sm:text-sm font-bold text-pink-600 dark:text-pink-300">
            Score: {score} / {lvlConfig.target}
          </div>
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

      {/* Game Playing Canvas */}
      <div
        ref={containerRef}
        onMouseMove={handlePointerMove}
        onTouchMove={handlePointerMove}
        className="relative w-full h-80 sm:h-96 rounded-2xl bg-gradient-to-b from-pink-50 via-purple-50/40 to-pink-100 dark:from-slate-800 dark:via-purple-950/20 dark:to-slate-800 border-2 border-dashed border-pink-300 dark:border-pink-800/60 overflow-hidden select-none cursor-ew-resize"
      >
        <div className="absolute top-4 left-6 text-2xl opacity-40 animate-float-slow">☁️</div>
        <div className="absolute top-10 right-8 text-2xl opacity-40 animate-float-medium">☁️</div>

        {/* Falling items */}
        {isPlaying &&
          items.map((item) => (
            <div
              key={item.id}
              className="absolute text-2xl sm:text-3xl filter drop-shadow-md transition-none -translate-x-1/2"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              {item.icon}
            </div>
          ))}

        {/* Player Basket */}
        <div
          className="absolute bottom-3 -translate-x-1/2 flex flex-col items-center transition-all duration-75"
          style={{ left: `${basketX}%` }}
        >
          <div className="px-4 py-1.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full text-xs font-bold shadow-lg border-2 border-white flex items-center gap-1">
            <span>🧺</span>
            <span>Nikki</span>
          </div>
          <div className="w-16 sm:w-20 h-4 bg-pink-400/30 rounded-full blur-sm mt-1" />
        </div>

        {/* Start / Level Clear / Game Over Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-white/85 dark:bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
            {levelWon ? (
              <>
                <div className="text-4xl mb-2">🎉 ❤️ 👑</div>
                <h3 className="font-display font-bold text-2xl text-slate-800 dark:text-white mb-1">
                  Level {currentLevel} Conquered!
                </h3>
                <p className="text-xs sm:text-sm text-pink-600 dark:text-pink-300 font-semibold mb-4">
                  You caught {score} points (Target: {lvlConfig.target}) in 30 seconds!
                </p>
                <button
                  onClick={onLevelComplete || (() => {
                    if (currentLevel < 3) startLevel(currentLevel + 1);
                    else startLevel(1);
                  })}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-glow-pink hover:scale-105 transition cursor-pointer"
                >
                  <span>
                    {onLevelComplete ? "Proceed to Level 2 (Balloon Pop) 🚀" : currentLevel < 3 ? `Advance to Level ${currentLevel + 1} 🚀` : "Replay Level 1 🔄"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : gameOver ? (
              <>
                <div className="text-4xl mb-2">⏳</div>
                <h3 className="font-display font-bold text-xl text-slate-800 dark:text-white mb-1">
                  30 Seconds Up!
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-4">
                  You scored {score} of required {lvlConfig.target} points.
                </p>
                <button
                  onClick={() => startLevel(currentLevel)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-glow-pink hover:scale-105 transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Level {currentLevel} Again</span>
                </button>
              </>
            ) : (
              <>
                <div className="text-5xl mb-3 animate-bounce">❤️🧺✨</div>
                <h3 className="font-display font-bold text-2xl text-slate-800 dark:text-white mb-1">
                  {lvlConfig.label}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xs mb-4">
                  Catch falling hearts to reach {lvlConfig.target} points in 30 seconds!
                </p>
                <button
                  onClick={() => startLevel(currentLevel)}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-glow-pink hover:scale-105 active:scale-95 transition cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Level {currentLevel} (30s)</span>
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
          aria-label="Move basket left"
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
          aria-label="Move basket right"
        >
          <span>MOVE RIGHT</span>
          <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400 text-center flex items-center justify-center gap-1">
        <span>📱 Mobile: Tap or hold buttons • 💻 PC: Arrow keys or mouse</span>
      </p>

      <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex-wrap">
        <span>❤️ (+10)</span>
        <span>💛 Gold (+25)</span>
        <span>⭐ Star (+50)</span>
        <span>💔 Broken (-10)</span>
      </div>
    </div>
  );
}
