import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Trophy,
  Lock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Star,
  Timer,
  Award,
  Crown
} from "lucide-react";
import { sound } from "../utils/audioSynth";
import { triggerConfetti, triggerGrandFireworks } from "../utils/confetti";

// Import all 11 games in exact level order
import CatchHearts from "../games/CatchHearts";
import BalloonPop from "../games/BalloonPop";
import WhackAMole from "../games/WhackAMole";
import CandyCatch from "../games/CandyCatch";
import HiddenHeart from "../games/HiddenHeart";
import GuessWord from "../games/GuessWord";
import ScratchCard from "../games/ScratchCard";
import MemoryChallenge from "../games/MemoryChallenge";
import MemoryMatch from "../games/MemoryMatch";
import TicTacToe from "../games/TicTacToe";
import BirthdayQuiz from "../games/BirthdayQuiz";

// 11 Levels definition
const ARCADE_LEVELS = [
  {
    level: 1,
    id: "catch-hearts",
    title: "Catch The Hearts",
    icon: "❤️",
    tagline: "Move your basket & catch falling love!",
    category: "Action",
    timerTag: "⏱️ 30s Countdown",
    description: "Catch the falling hearts & golden stars within 30 seconds to beat the level!",
    Component: CatchHearts
  },
  {
    level: 2,
    id: "balloon-pop",
    title: "Balloon Pop",
    icon: "🎈",
    tagline: "Pop balloons to reveal Nikki's photos & compliments!",
    category: "Casual",
    timerTag: "⏱️ 30s Countdown",
    description: "Pop the floating balloons featuring Nikki's face within 30s to unlock compliments!",
    Component: BalloonPop
  },
  {
    level: 3,
    id: "whack-a-mole",
    title: "Whack-A-Cutie",
    icon: "🐰",
    tagline: "Tap the popping Nikki cuties quickly!",
    category: "Arcade",
    timerTag: "⏱️ 30s Countdown",
    description: "Nikki's cute avatars pop out of pastel burrows! Tap them fast in 30 seconds.",
    Component: WhackAMole
  },
  {
    level: 4,
    id: "candy-catch",
    title: "Birthday Candy Catch",
    icon: "🍬",
    tagline: "Collect cupcakes & sweets, dodge storm clouds!",
    category: "Arcade",
    timerTag: "⏱️ 30s Countdown",
    description: "Gather cupcakes & strawberries into your tray in 30s while dodging clouds!",
    Component: CandyCatch
  },
  {
    level: 5,
    id: "hidden-heart",
    title: "Find The Hidden Hearts",
    icon: "💗",
    tagline: "Spot all camouflaged hearts before 30 seconds!",
    category: "Seek & Find",
    timerTag: "⏱️ 30s Countdown",
    description: "Search across the dreamscape and tap all hidden hearts in 30 seconds!",
    Component: HiddenHeart
  },
  {
    level: 6,
    id: "guess-word",
    title: "Guess The Word",
    icon: "🔤",
    tagline: "Decode Nikki's secret birthday keywords!",
    category: "Word Puzzle",
    timerTag: "⏱️ 30s Countdown",
    description: "Guess Nikki's secret birthday keyword before the 30-second clock expires!",
    Component: GuessWord
  },
  {
    level: 7,
    id: "scratch-card",
    title: "Scratch To Reveal",
    icon: "🪙",
    tagline: "Scratch off the foil within 30 seconds!",
    category: "Surprise",
    timerTag: "⏱️ 30s Countdown",
    description: "Scratch off the golden foil within 30 seconds to unveil secret birthday notes!",
    Component: ScratchCard
  },
  {
    level: 8,
    id: "memory-challenge",
    title: "Crystal Simon Says",
    icon: "🔮",
    tagline: "Repeat the musical glowing crystal rhythm!",
    category: "Music & Memory",
    timerTag: "⏱️ 30s Countdown",
    description: "Listen to the musical crystal tones and repeat the sequence in 30 seconds!",
    Component: MemoryChallenge
  },
  {
    level: 9,
    id: "memory-match",
    title: "Nikki's Photo Match",
    icon: "📸",
    tagline: "Flip and match Nikki's real photos!",
    category: "Photo Puzzle",
    timerTag: "🧩 Photo Memory Puzzle",
    description: "Flip the magical cards and find pairs of Nikki's real photos with fewest moves!",
    Component: MemoryMatch
  },
  {
    level: 10,
    id: "tic-tac-toe",
    title: "Hearts vs Stars",
    icon: "❌⭕",
    tagline: "Duel of wits: Nikki (💖) vs Stardust AI (⭐)!",
    category: "Strategy",
    timerTag: "🧠 Tactical Duel",
    description: "Play as Hearts in this classic duel of wits and defeat Stardust AI!",
    Component: TicTacToe
  },
  {
    level: 11,
    id: "birthday-quiz",
    title: "Nikki's Royal Birthday Quiz",
    icon: "👑",
    tagline: "10 cute questions celebrating Nikki!",
    category: "Grand Finale",
    timerTag: "👑 Grand Finale Quest",
    description: "Answer 10 hilarious, sweet questions about Nikki to crown the birthday champion!",
    Component: BirthdayQuiz
  }
];

export default function GameArcade({ unlockAchievement, onNavigate }) {
  // Current active level index (0 to 10)
  const [currentLevelIndex, setCurrentLevelIndex] = useState(() => {
    const saved = localStorage.getItem("nikki_arcade_current_level");
    return saved ? Math.min(Math.max(parseInt(saved, 10), 0), ARCADE_LEVELS.length - 1) : 0;
  });

  // Maximum unlocked level (1 to 11)
  const [maxUnlockedLevel, setMaxUnlockedLevel] = useState(() => {
    const saved = localStorage.getItem("nikki_arcade_max_unlocked");
    return saved ? Math.min(Math.max(parseInt(saved, 10), 1), ARCADE_LEVELS.length) : 1;
  });

  // Total arcade score
  const [arcadeScore, setArcadeScore] = useState(() => {
    return parseInt(localStorage.getItem("nikki_total_arcade_score") || "0", 10);
  });

  // Track if all levels completed
  const [allCompleted, setAllCompleted] = useState(() => {
    return localStorage.getItem("nikki_arcade_all_cleared") === "true";
  });

  // Save current level index
  useEffect(() => {
    localStorage.setItem("nikki_arcade_current_level", String(currentLevelIndex));
  }, [currentLevelIndex]);

  const handleScoreUpdate = (points) => {
    setArcadeScore((prev) => {
      const updated = prev + points;
      localStorage.setItem("nikki_total_arcade_score", String(updated));
      return updated;
    });
  };

  // Called when a level is beaten
  const handleLevelComplete = () => {
    sound.playSuccessFanfare();
    triggerGrandFireworks(2500);

    const nextLvl = currentLevelIndex + 2; // 1-based next level
    if (nextLvl > maxUnlockedLevel) {
      const newMax = Math.min(nextLvl, ARCADE_LEVELS.length);
      setMaxUnlockedLevel(newMax);
      localStorage.setItem("nikki_arcade_max_unlocked", String(newMax));
    }

    if (currentLevelIndex === ARCADE_LEVELS.length - 1) {
      // Beaten final level (Quiz)!
      setAllCompleted(true);
      localStorage.setItem("nikki_arcade_all_cleared", "true");
      if (unlockAchievement) {
        unlockAchievement("arcade_champion");
      }
    } else {
      // Advance to next level automatically
      setTimeout(() => {
        setCurrentLevelIndex((prev) => Math.min(prev + 1, ARCADE_LEVELS.length - 1));
        window.scrollTo({ top: 120, behavior: "smooth" });
      }, 600);
    }
  };

  const handleSelectLevel = (idx) => {
    // Only allow selecting unlocked levels (idx + 1 <= maxUnlockedLevel)
    if (idx + 1 <= maxUnlockedLevel) {
      sound.playClick();
      setCurrentLevelIndex(idx);
    } else {
      sound.playWhack();
    }
  };

  const handlePrevLevel = () => {
    if (currentLevelIndex > 0) {
      sound.playClick();
      setCurrentLevelIndex((prev) => prev - 1);
    }
  };

  const handleNextLevel = () => {
    if (currentLevelIndex < ARCADE_LEVELS.length - 1 && currentLevelIndex + 2 <= maxUnlockedLevel) {
      sound.playClick();
      setCurrentLevelIndex((prev) => prev + 1);
    }
  };

  const currentLevelData = ARCADE_LEVELS[currentLevelIndex] || ARCADE_LEVELS[0];
  const ActiveGameComponent = currentLevelData?.Component || CatchHearts;

  return (
    <section className="relative min-h-[calc(100vh-4rem)] px-4 py-8 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="text-center max-w-2xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-950/60 dark:to-purple-950/60 border border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-300 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
          <span>Nikki's Birthday Arcade Journey</span>
        </div>
        <h2 className="font-display font-bold text-2xl sm:text-4xl text-slate-800 dark:text-white">
          Level-by-Level Birthday Arcade 🎮✨
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-lg mx-auto">
          Clear each level to unlock the next! 30-second rush on action levels, followed by Nikki's photo puzzle, strategy & grand quiz!
        </p>

        {/* Total Score & Progress Tag */}
        <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold shadow-sm">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Nikki's Total Points: {arcadeScore} ⭐</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-300 text-xs font-bold shadow-sm">
            <Crown className="w-3.5 h-3.5 text-pink-500" />
            <span>Unlocked: Level {maxUnlockedLevel} of 11</span>
          </div>
        </div>
      </div>

      {/* HORIZONTAL LEVEL ROADMAP STEPPER */}
      <div className="w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl p-3 sm:p-5 border border-pink-200 dark:border-pink-900/60 shadow-lg mb-8">
        <div className="flex items-center justify-between mb-3 px-1 text-xs font-bold text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1 text-pink-600 dark:text-pink-300">
            <span>Level {currentLevelIndex + 1} of 11:</span>
            <span className="font-semibold">{currentLevelData.title}</span>
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Progress: {Math.round(((currentLevelIndex + 1) / ARCADE_LEVELS.length) * 100)}%
          </span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-2 bg-pink-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 transition-all duration-500 rounded-full"
            style={{ width: `${((currentLevelIndex + 1) / ARCADE_LEVELS.length) * 100}%` }}
          />
        </div>

        {/* 11 Level Stepper Badges */}
        <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
          {ARCADE_LEVELS.map((lvl, idx) => {
            const isCompleted = idx + 1 < maxUnlockedLevel;
            const isCurrent = idx === currentLevelIndex;
            const isUnlocked = idx + 1 <= maxUnlockedLevel;

            return (
              <button
                key={lvl.id}
                onClick={() => handleSelectLevel(idx)}
                disabled={!isUnlocked}
                className={`relative flex flex-col items-center justify-center min-w-[58px] sm:min-w-[68px] py-2 px-1 rounded-2xl transition-all duration-300 cursor-pointer ${
                  isCurrent
                    ? "bg-gradient-to-b from-pink-500 to-purple-600 text-white shadow-glow-pink scale-105 border-2 border-white dark:border-pink-300"
                    : isUnlocked
                    ? "bg-pink-50/80 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-pink-200 dark:border-slate-700 hover:bg-pink-100"
                    : "bg-slate-100 dark:bg-slate-800/40 text-slate-400 opacity-60 cursor-not-allowed border border-dashed border-slate-300 dark:border-slate-700"
                }`}
              >
                {/* Level icon / lock indicator */}
                <div className="text-lg sm:text-xl relative mb-0.5">
                  {lvl.icon}
                  {isCompleted && (
                    <span className="absolute -top-1 -right-2 text-[10px]">✅</span>
                  )}
                  {!isUnlocked && (
                    <span className="absolute -top-1 -right-2 text-[10px]">🔒</span>
                  )}
                </div>

                {/* Level text */}
                <span className={`text-[10px] font-extrabold uppercase ${isCurrent ? "text-white" : "text-pink-600 dark:text-pink-300"}`}>
                  Lvl {lvl.level}
                </span>

                {/* Status Dot */}
                {isCurrent && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE LEVEL CONTROLS BAR */}
      <div className="flex items-center justify-between max-w-xl mx-auto mb-4 px-2">
        <button
          onClick={handlePrevLevel}
          disabled={currentLevelIndex === 0}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
            currentLevelIndex > 0
              ? "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-pink-200 dark:border-slate-700 hover:bg-pink-50 shadow-sm cursor-pointer"
              : "opacity-40 cursor-not-allowed text-slate-400"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev Level</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 text-xs font-bold">
          <span>{currentLevelData.timerTag}</span>
        </div>

        <button
          onClick={handleNextLevel}
          disabled={currentLevelIndex >= ARCADE_LEVELS.length - 1 || currentLevelIndex + 2 > maxUnlockedLevel}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
            currentLevelIndex < ARCADE_LEVELS.length - 1 && currentLevelIndex + 2 <= maxUnlockedLevel
              ? "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-pink-200 dark:border-slate-700 hover:bg-pink-50 shadow-sm cursor-pointer"
              : "opacity-40 cursor-not-allowed text-slate-400"
          }`}
        >
          <span>Next Level</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ACTIVE LEVEL HEADER */}
      <div className="text-center max-w-xl mx-auto mb-6">
        <h3 className="font-display font-bold text-2xl sm:text-3xl text-slate-800 dark:text-white flex items-center justify-center gap-2">
          <span>{currentLevelData.icon}</span>
          <span>Level {currentLevelData.level}: {currentLevelData.title}</span>
        </h3>
        <p className="text-xs sm:text-sm text-pink-600 dark:text-pink-300 font-medium mt-1">
          {currentLevelData.tagline}
        </p>
      </div>

      {/* ACTIVE LEVEL GAME COMPONENT */}
      <div className="w-full flex justify-center mb-8">
        <ActiveGameComponent
          onScoreUpdate={handleScoreUpdate}
          unlockAchievement={unlockAchievement}
          onLevelComplete={handleLevelComplete}
        />
      </div>

      {/* ALL LEVELS COMPLETED GRAND CERTIFICATE */}
      {allCompleted && (
        <div className="max-w-2xl mx-auto my-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white text-center shadow-glow-purple animate-fadeIn">
          <div className="text-5xl mb-2 animate-bounce">👑 🏆 🎉</div>
          <h3 className="font-display font-extrabold text-2xl sm:text-3xl">
            ARCADE MASTER NIKKI!
          </h3>
          <p className="text-sm sm:text-base text-pink-100 max-w-md mx-auto mt-2">
            You successfully conquered all 11 magical levels of the Birthday Arcade! You are truly undefeated, brilliant, and wonderful!
          </p>
          <div className="inline-flex items-center gap-2 px-5 py-2 mt-4 rounded-full bg-white/20 backdrop-blur-md font-bold text-sm">
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>Total Points Mastered: {arcadeScore} Points</span>
          </div>
          <div className="mt-6">
            <button
              onClick={() => onNavigate && onNavigate("memories")}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-pink-600 bg-white hover:bg-pink-50 hover:scale-105 active:scale-95 shadow-xl transition cursor-pointer"
            >
              <span>PROCEED TO NIKKI'S MEMORY SCRAPBOOK 📸 ➜</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION NAVIGATION (PREVIOUS & NEXT SURPRISE) */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-pink-200 dark:border-pink-900/50 shadow-lg">
        <button
          onClick={() => onNavigate && onNavigate("gift")}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-pink-200 dark:border-slate-700 hover:bg-pink-50 transition shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back: 3D Gift Box 🎁</span>
        </button>

        <button
          onClick={() => onNavigate && onNavigate("memories")}
          className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 shadow-glow-pink hover:shadow-glow-purple hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span>NEXT: NIKKI'S MEMORIES 📸</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
        </button>
      </div>
    </section>
  );
}
