import React, { useState, useEffect } from "react";
import { Sparkles, RotateCcw, Heart, MessageCircleHeart, Timer, Trophy, ArrowRight, CheckCircle2 } from "lucide-react";
import { balloonCompliments } from "../data/gamesData";
import { nikkiPhotos } from "../data/memories";
import { sound } from "../utils/audioSynth";
import { triggerConfetti, triggerGrandFireworks } from "../utils/confetti";

const BALLOON_COLORS = [
  "#FF69B4", "#BA55D3", "#FF6347", "#FFD700", "#00CED1",
  "#FFB6C1", "#9370DB", "#FF8C00", "#FF1493", "#48D1CC"
];

const LEVEL_CONFIGS = [
  { level: 1, target: 6, time: 30, speedMin: 0.6, speedMax: 1.1, title: "Level 1: Gentle Breezes 🌸" },
  { level: 2, target: 10, time: 30, speedMin: 1.0, speedMax: 1.7, title: "Level 2: Dancing Stardust ✨" },
  { level: 3, target: 14, time: 30, speedMin: 1.4, speedMax: 2.3, title: "Level 3: Queen's Jubilee Frenzy 👑" },
];

export default function BalloonPop({ onScoreUpdate, unlockAchievement, onLevelComplete }) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [levelPopped, setLevelPopped] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [balloons, setBalloons] = useState([]);
  const [latestPop, setLatestPop] = useState(null); // { photo, wish, name }
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const config = LEVEL_CONFIGS[currentLevel - 1] || LEVEL_CONFIGS[0];

  const startLevel = (lvl = currentLevel) => {
    sound.playSparkle();
    setCurrentLevel(lvl);
    setLevelPopped(0);
    setTimeLeft(30);
    setLatestPop(null);
    setLevelCompleted(false);
    setGameOver(false);
    setBalloons([]);
    setIsPlaying(true);
  };

  // 30-Second Countdown timer
  useEffect(() => {
    if (!isPlaying) return;
    if (timeLeft <= 0) {
      setIsPlaying(false);
      setGameOver(true);
      sound.playWhack();
      return;
    }

    const t = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(t);
  }, [isPlaying, timeLeft]);

  // Spawn balloons that carry Nikki's photo inside
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setBalloons((prev) => {
        if (prev.length >= 8) return prev; // max 8 floating

        const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
        const wish = balloonCompliments[Math.floor(Math.random() * balloonCompliments.length)];
        const photoObj = nikkiPhotos[Math.floor(Math.random() * nikkiPhotos.length)];

        const newBalloon = {
          id: Date.now() + Math.random(),
          x: 10 + Math.random() * 80,
          y: 110, // start below bottom
          speed: config.speedMin + Math.random() * (config.speedMax - config.speedMin),
          color: color,
          size: 58 + Math.random() * 16,
          wish: wish,
          photo: photoObj.url,
          label: photoObj.label,
        };
        return [...prev, newBalloon];
      });
    }, 700);

    return () => clearInterval(interval);
  }, [isPlaying, config]);

  // Upward float animation loop
  useEffect(() => {
    if (!isPlaying) return;
    let animId;
    const loop = () => {
      setBalloons((prev) =>
        prev
          .map((b) => ({ ...b, y: b.y - b.speed }))
          .filter((b) => b.y > -25)
      );
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying]);

  const handlePop = (balloon) => {
    if (!isPlaying) return;

    sound.playPop();
    setBalloons((prev) => prev.filter((b) => b.id !== balloon.id));

    // Show Nikki's Face Popup
    setLatestPop({
      photo: balloon.photo,
      wish: balloon.wish,
      label: balloon.label,
    });

    triggerConfetti({
      particleCount: 30,
      origin: { x: balloon.x / 100, y: Math.max(0.1, balloon.y / 100) },
      colors: [balloon.color, "#FF69B4", "#FFD700", "#FFF"],
    });

    const nextCount = levelPopped + 1;
    setLevelPopped(nextCount);

    if (onScoreUpdate) onScoreUpdate(15);

    // Check level clear
    if (nextCount >= config.target) {
      sound.playSuccessFanfare();
      triggerGrandFireworks(2500);
      setIsPlaying(false);
      setLevelCompleted(true);

      if (currentLevel === 3 && unlockAchievement) {
        unlockAchievement("balloon_popper");
      }
    }
  };

  const handleNextLevel = () => {
    if (currentLevel < LEVEL_CONFIGS.length) {
      startLevel(currentLevel + 1);
    } else {
      // Replay level 1
      startLevel(1);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4 sm:p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-pink-200 dark:border-pink-900/60 shadow-xl">
      {/* Top Bar with Level, Target, and 30s Timer */}
      <div className="w-full flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-1.5">
          <span className="px-2.5 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 text-xs font-bold">
            Level {currentLevel} of 3
          </span>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Target: {levelPopped} / {config.target} 🎈
          </span>
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

      {/* Floating Balloon Sky Canvas */}
      <div className="relative w-full h-80 sm:h-96 rounded-2xl bg-gradient-to-b from-sky-100 via-pink-50 to-purple-100 dark:from-slate-800 dark:via-purple-950/30 dark:to-slate-800 border-2 border-dashed border-pink-200 dark:border-pink-800/60 overflow-hidden select-none cursor-pointer">
        {/* Clouds */}
        <div className="absolute top-4 left-6 text-3xl opacity-50 animate-float-slow pointer-events-none">☁️</div>
        <div className="absolute top-16 right-10 text-2xl opacity-50 animate-float-medium pointer-events-none">☁️</div>

        {/* Floating Balloons WITH NIKKI'S FACE */}
        {isPlaying &&
          balloons.map((b) => (
            <div
              key={b.id}
              onClick={() => handlePop(b)}
              className="absolute -translate-x-1/2 cursor-pointer transition-transform hover:scale-110 active:scale-90"
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
              }}
            >
              {/* Balloon shape */}
              <div
                className="rounded-full shadow-lg relative flex items-center justify-center p-1.5"
                style={{
                  width: `${b.size}px`,
                  height: `${b.size * 1.25}px`,
                  backgroundColor: b.color,
                  borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
                }}
              >
                {/* Nikki's Face inside balloon */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white shadow-md bg-white">
                  <img
                    src={b.photo}
                    alt="Nikki"
                    className="w-full h-full object-cover pointer-events-none"
                  />
                </div>

                {/* String */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-10 bg-slate-400/60" />
              </div>
            </div>
          ))}

        {/* Overlays: Start / Level Clear / Game Over */}
        {!isPlaying && (
          <div className="absolute inset-0 bg-white/85 dark:bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
            {levelCompleted ? (
              <>
                <div className="text-4xl mb-2">🎉 👑 🎈</div>
                <h4 className="font-display font-bold text-2xl text-slate-800 dark:text-white mb-1">
                  Level {currentLevel} Cleared!
                </h4>
                <p className="text-xs sm:text-sm text-pink-600 dark:text-pink-300 font-semibold mb-4">
                  Nikki, you popped all {config.target} balloons in under 30 seconds!
                </p>
                <button
                  onClick={onLevelComplete || handleNextLevel}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-glow-pink hover:scale-105 transition cursor-pointer"
                >
                  <span>
                    {onLevelComplete ? "Proceed to Level 3 (Whack-A-Cutie) 🚀" : currentLevel < LEVEL_CONFIGS.length ? `Proceed to Level ${currentLevel + 1} 🚀` : "Replay Level 1 🔄"}
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
                  You popped {levelPopped} of {config.target} balloons. Try again!
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
                <div className="text-5xl mb-3 animate-bounce">🎈✨❤️</div>
                <h4 className="font-display font-bold text-2xl text-slate-800 dark:text-white mb-1">
                  Balloon Pop - {config.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xs mb-4">
                  Pop {config.target} balloons with Nikki's photos within 30 seconds to reveal secret sweet notes!
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

      {/* POPPED FACE POPUP CARD (Requested by user: "ballons amdyalo tana face popups pettu ok na") */}
      {latestPop && (
        <div className="w-full mt-4 p-4 rounded-3xl bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 dark:from-pink-950/40 dark:via-purple-950/40 dark:to-slate-800 border-2 border-pink-300 dark:border-pink-800 flex items-center gap-4 shadow-lg animate-fadeIn">
          {/* Circular Face Avatar with glowing border */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-3 border-pink-400 shadow-md flex-shrink-0 bg-white">
            <img
              src={latestPop.photo}
              alt="Nikki"
              className="w-full h-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 text-xs">✨</div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full bg-pink-200 dark:bg-pink-900 text-pink-700 dark:text-pink-200">
                {latestPop.label}
              </span>
              <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 italic leading-snug">
              "{latestPop.wish}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
