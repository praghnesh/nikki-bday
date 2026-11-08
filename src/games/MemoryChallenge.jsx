import React, { useState, useEffect } from "react";
import { Play, RotateCcw, Trophy, Sparkles, Volume2, Timer, ArrowRight } from "lucide-react";
import { sound } from "../utils/audioSynth";
import { triggerConfetti } from "../utils/confetti";

const CRYSTALS = [
  { id: 0, color: "from-pink-400 to-rose-500", label: "Rose Crystal", glow: "shadow-pink-500/50", icon: "🌸" },
  { id: 1, color: "from-purple-400 to-indigo-500", label: "Amethyst", glow: "shadow-purple-500/50", icon: "🔮" },
  { id: 2, color: "from-amber-300 to-yellow-500", label: "Citrine", glow: "shadow-yellow-500/50", icon: "⭐" },
  { id: 3, color: "from-teal-300 to-cyan-500", label: "Aquamarine", glow: "shadow-cyan-500/50", icon: "💎" },
];

export default function MemoryChallenge({ onScoreUpdate, unlockAchievement, onLevelComplete }) {
  const [sequence, setSequence] = useState([]);
  const [playerStep, setPlayerStep] = useState(0);
  const [isPlayingSeq, setIsPlayingSeq] = useState(false);
  const [activeButton, setActiveButton] = useState(null);
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem("nikki_simon_high") || "1", 10);
  });

  // 30s Countdown timer per level round
  useEffect(() => {
    if (!gameStarted || isPlayingSeq || gameOver) return;
    if (timeLeft <= 0) {
      sound.playWhack();
      setGameOver(true);
      setGameStarted(false);
      return;
    }

    const t = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(t);
  }, [gameStarted, isPlayingSeq, gameOver, timeLeft]);

  const startNewGame = () => {
    sound.playSparkle();
    const firstStep = Math.floor(Math.random() * 4);
    const newSeq = [firstStep];
    setSequence(newSeq);
    setLevel(1);
    setTimeLeft(30);
    setPlayerStep(0);
    setGameOver(false);
    setGameStarted(true);
    playSequence(newSeq);
  };

  const playSequence = (seq) => {
    setIsPlayingSeq(true);
    seq.forEach((crystalId, index) => {
      setTimeout(() => {
        activateCrystal(crystalId);
      }, (index + 1) * 600);
    });

    setTimeout(() => {
      setIsPlayingSeq(false);
      setPlayerStep(0);
      setTimeLeft(30); // reset 30s for player turn
    }, (seq.length + 1) * 600);
  };

  const activateCrystal = (id) => {
    setActiveButton(id);
    sound.playSimonNote(id);
    setTimeout(() => {
      setActiveButton(null);
    }, 380);
  };

  const handleCrystalClick = (id) => {
    if (isPlayingSeq || gameOver || !gameStarted) return;

    activateCrystal(id);

    // Verify player input
    if (id === sequence[playerStep]) {
      const nextStep = playerStep + 1;
      setPlayerStep(nextStep);

      // Completed full sequence for this level!
      if (nextStep === sequence.length) {
        sound.playChime();
        const nextLevel = level + 1;
        setLevel(nextLevel);

        if (nextLevel > highScore) {
          setHighScore(nextLevel);
          localStorage.setItem("nikki_simon_high", String(nextLevel));
        }

        if (nextLevel >= 5 && unlockAchievement) {
          unlockAchievement("enter_universe");
        }

        if (onScoreUpdate) onScoreUpdate(level * 20);

        // Next round
        setTimeout(() => {
          const nextCrystal = Math.floor(Math.random() * 4);
          const nextSeq = [...sequence, nextCrystal];
          setSequence(nextSeq);
          playSequence(nextSeq);
        }, 900);
      }
    } else {
      sound.playWhack();
      setGameOver(true);
      setGameStarted(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto p-4 sm:p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-pink-200 dark:border-pink-900/60 shadow-xl">
      {/* Top Header with Level, Timer and Best */}
      <div className="w-full flex items-center justify-between mb-4 px-2">
        <div className="text-xs sm:text-sm font-bold text-pink-600 dark:text-pink-300">
          Level {level}
        </div>

        {/* 30 Seconds Timer */}
        <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
          <Timer className="w-4 h-4 text-purple-500" />
          <span>{timeLeft}s</span>
        </div>

        <div className="text-xs font-semibold text-amber-600 dark:text-amber-300 flex items-center gap-1">
          <Trophy className="w-3.5 h-3.5" />
          <span>Best: {highScore}</span>
        </div>
      </div>

      {/* 4 Crystals Circular Layout */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 grid grid-cols-2 gap-3 p-3 bg-pink-100/50 dark:bg-slate-800/50 rounded-full border-4 border-pink-200 dark:border-pink-900 shadow-inner my-2 select-none">
        {CRYSTALS.map((crystal) => {
          const isActive = activeButton === crystal.id;
          return (
            <button
              key={crystal.id}
              onClick={() => handleCrystalClick(crystal.id)}
              disabled={isPlayingSeq || !gameStarted}
              className={`rounded-3xl bg-gradient-to-br ${crystal.color} transition-all duration-200 flex flex-col items-center justify-center text-white text-2xl sm:text-3xl shadow-lg border-2 border-white/60 active:scale-95 cursor-pointer ${
                isActive ? `scale-105 brightness-125 ${crystal.glow} shadow-2xl ring-4 ring-white` : "opacity-90 hover:opacity-100"
              }`}
            >
              <span className="filter drop-shadow-md">{crystal.icon}</span>
            </button>
          );
        })}

        {/* Center Orb */}
        <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-white dark:bg-slate-900 border-2 border-pink-300 dark:border-slate-700 shadow-xl flex items-center justify-center font-display font-bold text-xs text-pink-600 dark:text-pink-300 pointer-events-none">
          Lvl {level}
        </div>
      </div>

      {/* Control Button / Game Over Banner */}
      <div className="mt-4 text-center flex flex-col items-center gap-3">
        {!gameStarted ? (
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={startNewGame}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 transition shadow-glow-pink cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{gameOver ? "Try Sequence Again" : "Start Musical Rhythm (30s)"}</span>
            </button>

            {onLevelComplete && (
              <button
                onClick={onLevelComplete}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 transition shadow-sm cursor-pointer"
              >
                <span>Proceed to Level 9 (Photo Match) 🚀</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isPlayingSeq ? "🎵 Playing melody..." : `Your turn (30s): step ${playerStep + 1} of ${sequence.length}`}
            </p>
            {level >= 2 && onLevelComplete && (
              <button
                onClick={onLevelComplete}
                className="inline-flex items-center gap-1.5 text-xs text-pink-600 dark:text-pink-300 hover:underline font-bold mt-1 cursor-pointer"
              >
                <span>Proceed to Level 9 (Photo Match) 🚀</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {gameOver && (
          <div className="mt-3 p-3 rounded-2xl bg-rose-50 dark:bg-slate-800 border border-rose-200 text-xs text-rose-600 dark:text-rose-300 font-semibold animate-fadeIn">
            {timeLeft <= 0 ? "30 seconds up! " : "Oops, wrong crystal! "}You reached Level {level}!
          </div>
        )}
      </div>
    </div>
  );
}
