import React, { useState, useEffect } from "react";
import { RotateCcw, Heart, HelpCircle, Trophy, Sparkles, Check, ArrowRight, Timer } from "lucide-react";
import { wordGuessingWords } from "../data/gamesData";
import { sound } from "../utils/audioSynth";
import { triggerConfetti } from "../utils/confetti";

export default function GuessWord({ onScoreUpdate, unlockAchievement, onLevelComplete }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [guessedLetters, setGuessedLetters] = useState(new Set());
  const [lives, setLives] = useState(6);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showHint, setShowHint] = useState(false);
  const [gameStatus, setGameStatus] = useState("playing"); // 'playing', 'won', 'lost'
  const [score, setScore] = useState(0);

  const currentItem = wordGuessingWords[currentWordIndex];
  const targetWord = currentItem.word.toUpperCase();

  const isWon = targetWord.split("").every((letter) => guessedLetters.has(letter));

  // 30s Countdown timer per word
  useEffect(() => {
    if (gameStatus !== "playing") return;
    if (timeLeft <= 0) {
      setGameStatus("lost");
      sound.playWhack();
      return;
    }

    const t = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(t);
  }, [gameStatus, timeLeft]);

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameStatus !== "playing") return;
      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        guessLetter(key);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [guessedLetters, lives, gameStatus, targetWord]);

  // Check win state
  useEffect(() => {
    if (gameStatus !== "playing") return;

    if (isWon) {
      setGameStatus("won");
      sound.playSuccessFanfare();
      triggerConfetti({ particleCount: 70 });
      setScore((s) => s + 30);
      if (unlockAchievement) unlockAchievement("enter_universe");
      if (onScoreUpdate) onScoreUpdate(30);
    } else if (lives <= 0) {
      setGameStatus("lost");
      sound.playWhack();
    }
  }, [guessedLetters, lives]);

  const guessLetter = (letter) => {
    if (guessedLetters.has(letter) || gameStatus !== "playing") return;

    sound.playClick();
    const nextGuessed = new Set(guessedLetters);
    nextGuessed.add(letter);
    setGuessedLetters(nextGuessed);

    if (!targetWord.includes(letter)) {
      setLives((l) => l - 1);
    } else {
      sound.playChime();
    }
  };

  const nextWord = () => {
    sound.playSparkle();
    const nextIdx = (currentWordIndex + 1) % wordGuessingWords.length;
    setCurrentWordIndex(nextIdx);
    setGuessedLetters(new Set());
    setLives(6);
    setTimeLeft(30);
    setShowHint(false);
    setGameStatus("playing");
  };

  const resetGame = () => {
    sound.playClick();
    setCurrentWordIndex(0);
    setGuessedLetters(new Set());
    setLives(6);
    setTimeLeft(30);
    setShowHint(false);
    setGameStatus("playing");
    setScore(0);
  };

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto p-4 sm:p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-pink-200 dark:border-pink-900/60 shadow-xl">
      {/* Top Bar with Level, 30s Timer & Lives */}
      <div className="w-full flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-pink-600 dark:text-pink-300">
          <span className="px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/60">
            Level {currentWordIndex + 1} of {wordGuessingWords.length}
          </span>
          <span className="text-[11px] font-semibold text-slate-500">({currentItem.difficulty})</span>
        </div>

        {/* 30 Seconds Timer */}
        <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
          <Timer className="w-4 h-4 text-purple-500" />
          <span>{timeLeft}s</span>
        </div>

        {/* Lives / Hearts */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <Heart
              key={i}
              className={`w-3.5 h-3.5 transition-all ${
                i < lives
                  ? "text-rose-500 fill-rose-500 scale-100"
                  : "text-slate-300 dark:text-slate-700 scale-75"
              }`}
            />
          ))}
        </div>

        <button
          onClick={resetGame}
          className="p-1.5 rounded-full hover:bg-pink-100 dark:hover:bg-slate-800 text-pink-600 dark:text-pink-300 transition cursor-pointer"
          title="Restart"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Word Letters Display */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 my-6 min-h-[4rem]">
        {targetWord.split("").map((letter, idx) => {
          const isRevealed = guessedLetters.has(letter) || gameStatus === "lost";
          return (
            <div
              key={idx}
              className={`w-9 h-12 sm:w-11 sm:h-14 rounded-xl border-2 flex items-center justify-center font-display font-bold text-xl sm:text-2xl shadow-sm transition-all ${
                isRevealed
                  ? "bg-white dark:bg-slate-800 border-pink-400 text-pink-600 dark:text-pink-300 scale-100"
                  : "bg-pink-50 dark:bg-slate-800/50 border-pink-200 dark:border-slate-700 text-transparent"
              }`}
            >
              {isRevealed ? letter : ""}
            </div>
          );
        })}
      </div>

      {/* Hint Banner */}
      <div className="w-full text-center mb-4">
        {showHint ? (
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 font-medium">
            💡 Hint: {currentItem.hint}
          </div>
        ) : (
          <button
            onClick={() => {
              sound.playClick();
              setShowHint(true);
            }}
            className="inline-flex items-center gap-1.5 text-xs text-pink-500 hover:text-pink-600 font-semibold underline cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Need a gentle hint?</span>
          </button>
        )}
      </div>

      {/* Game Outcome Actions */}
      {gameStatus !== "playing" && (
        <div className="w-full text-center p-3 mb-4 rounded-2xl bg-pink-100 dark:bg-slate-800 border border-pink-200 dark:border-slate-700 animate-fadeIn">
          {gameStatus === "won" ? (
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>You nailed it, Nikki! Amazing job! 🎉</span>
            </div>
          ) : (
            <div className="text-sm font-semibold text-rose-500">
              {timeLeft <= 0 ? "30 seconds up! " : ""}The word was <strong className="font-bold underline">{targetWord}</strong>.
            </div>
          )}
          <button
            onClick={gameStatus === "won" && onLevelComplete ? onLevelComplete : nextWord}
            className="mt-2.5 inline-flex items-center gap-1.5 px-6 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 transition cursor-pointer shadow-sm"
          >
            <span>
              {gameStatus === "won" && onLevelComplete ? "Proceed to Level 7 (Scratch Card) 🚀" : `Proceed to Level ${((currentWordIndex + 1) % wordGuessingWords.length) + 1} 🚀`}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Virtual On-screen Keyboard */}
      <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5 w-full">
        {alphabet.map((letter) => {
          const isGuessed = guessedLetters.has(letter);
          const isCorrect = isGuessed && targetWord.includes(letter);
          const isWrong = isGuessed && !targetWord.includes(letter);

          return (
            <button
              key={letter}
              onClick={() => guessLetter(letter)}
              disabled={isGuessed || gameStatus !== "playing"}
              className={`h-9 rounded-xl font-bold text-xs sm:text-sm transition flex items-center justify-center ${
                isCorrect
                  ? "bg-emerald-500 text-white border border-emerald-600"
                  : isWrong
                  ? "bg-slate-200 dark:bg-slate-800 text-slate-400 opacity-40 cursor-not-allowed"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-pink-100 dark:border-slate-700 hover:bg-pink-100 dark:hover:bg-slate-700 active:scale-95 shadow-sm cursor-pointer"
              }`}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </div>
  );
}
