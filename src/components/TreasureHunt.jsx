import React, { useState } from "react";
import { Compass, Key, Sparkles, Lock, Unlock, HelpCircle, Trophy, Check, ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";
import { birthdayData } from "../data/birthdayData";
import { sound } from "../utils/audioSynth";
import { triggerConfetti, triggerGrandFireworks } from "../utils/confetti";

export default function TreasureHunt({ unlockAchievement, onNavigate }) {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [inputAnswer, setInputAnswer] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [solvedLevels, setSolvedLevels] = useState(new Set());
  const [vaultUnlocked, setVaultUnlocked] = useState(false);

  const { levels, title, subtitle, finalVaultMessage } = birthdayData.treasureHunt;
  const currentLevel = levels[currentLevelIndex];

  const handleVerify = (e) => {
    e.preventDefault();
    setErrorMessage("");

    const normalized = inputAnswer.trim().toLowerCase();
    const isCorrect = currentLevel.acceptedAnswers.some(
      (ans) => ans.toLowerCase() === normalized
    );

    if (isCorrect) {
      sound.playChime();
      sound.playSparkle();
      const updatedSolved = new Set(solvedLevels);
      updatedSolved.add(currentLevel.level);
      setSolvedLevels(updatedSolved);
      setInputAnswer("");
      setShowHint(false);

      if (currentLevelIndex < levels.length - 1) {
        setCurrentLevelIndex((prev) => prev + 1);
      } else {
        // All 4 clues solved!
        setVaultUnlocked(true);
        sound.playSuccessFanfare();
        triggerGrandFireworks(4000);
        triggerConfetti({ particleCount: 120, spread: 100 });
        unlockAchievement("treasure_solved");
      }
    } else {
      sound.playWhack();
      setErrorMessage("Not quite right! Take another guess or check the hint!");
    }
  };

  const handleReset = () => {
    sound.playClick();
    setCurrentLevelIndex(0);
    setInputAnswer("");
    setErrorMessage("");
    setShowHint(false);
    setSolvedLevels(new Set());
    setVaultUnlocked(false);
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-300 text-xs font-semibold mb-3">
          <Compass className="w-3.5 h-3.5 text-pink-500 animate-spin-slow" />
          <span>Interactive Detective Quest</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-800 dark:text-white">
          {title}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          {subtitle}
        </p>
      </div>

      {/* Level Map Stepper */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 w-full max-w-md">
        {levels.map((lvl, idx) => {
          const isDone = solvedLevels.has(lvl.level);
          const isCurrent = currentLevelIndex === idx && !vaultUnlocked;
          return (
            <React.Fragment key={lvl.level}>
              <button
                onClick={() => {
                  if (isDone || idx <= solvedLevels.size) {
                    sound.playClick();
                    setCurrentLevelIndex(idx);
                  }
                }}
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-xs sm:text-sm font-bold transition-all shadow-sm ${
                  isDone
                    ? "bg-emerald-500 text-white shadow-md scale-105"
                    : isCurrent
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-glow-pink scale-110"
                    : "bg-white dark:bg-slate-800 text-slate-400 border border-pink-100 dark:border-slate-700"
                }`}
              >
                {isDone ? <Check className="w-5 h-5" /> : `0${lvl.level}`}
              </button>
              {idx < levels.length - 1 && (
                <div
                  className={`flex-1 h-1 rounded-full transition-all ${
                    isDone ? "bg-emerald-400" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {!vaultUnlocked ? (
        /* Clue Riddle Parchment Card */
        <div className="w-full max-w-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-pink-200 dark:border-pink-900/60 rounded-3xl p-6 sm:p-10 shadow-2xl animate-fadeIn">
          {/* Card Tag */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-600 dark:text-pink-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-pink-500" />
              <span>{currentLevel.title}</span>
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Level {currentLevel.level} of {levels.length}
            </span>
          </div>

          {/* Riddle Text */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-50/70 to-purple-50/70 dark:from-slate-800 dark:to-slate-800/60 border border-pink-100 dark:border-slate-700 mb-6">
            <p className="font-handwriting text-xl sm:text-2xl text-slate-800 dark:text-pink-100 leading-relaxed text-center">
              "{currentLevel.riddle}"
            </p>
          </div>

          {/* Password Answer Input Form */}
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Enter your answer / secret password..."
                value={inputAnswer}
                onChange={(e) => setInputAnswer(e.target.value)}
                className="w-full px-5 py-3.5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-pink-200 dark:border-slate-700 focus:border-pink-500 dark:focus:border-pink-400 outline-none text-slate-800 dark:text-slate-100 font-medium text-sm transition placeholder:text-slate-400"
              />
              {errorMessage && (
                <p className="text-xs text-rose-500 font-semibold mt-2 text-center animate-fadeIn">
                  {errorMessage}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="submit"
                className="w-full sm:flex-1 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-[1.02] active:scale-95 transition shadow-glow-pink cursor-pointer"
              >
                <span>Unlock Clue #{currentLevel.level} ✨</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowHint(!showHint);
                }}
                className="px-4 py-3 rounded-2xl border border-pink-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-slate-800 transition flex items-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5 text-pink-500" />
                <span>{showHint ? "Hide Hint" : "Need Hint?"}</span>
              </button>
            </div>
          </form>

          {/* Hint Dropdown */}
          {showHint && (
            <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 text-center animate-fadeIn">
              💡 Hint: {currentLevel.hint}
            </div>
          )}
        </div>
      ) : (
        /* Final Vault Unlocked Reveal */
        <div className="w-full max-w-xl bg-gradient-to-br from-amber-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-950/60 dark:to-slate-900 border-4 border-amber-300 dark:border-amber-600 rounded-3xl p-6 sm:p-10 shadow-2xl text-center animate-fadeIn">
          <div className="text-5xl mb-3">👑 💎 🏆 ✨</div>
          <div className="inline-block px-4 py-1 rounded-full bg-amber-200 dark:bg-amber-950 text-amber-800 dark:text-amber-200 text-xs font-extrabold uppercase tracking-widest mb-3">
            {finalVaultMessage.title}
          </div>
          <h3 className="font-display font-bold text-2xl sm:text-3xl text-slate-800 dark:text-white mb-4">
            Quest Solved, Detective Nikki!
          </h3>
          <p className="font-handwriting text-xl sm:text-2xl text-slate-700 dark:text-pink-100 max-w-md mx-auto leading-relaxed mb-6">
            "{finalVaultMessage.tribute}"
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-pink-200 dark:border-slate-700 hover:bg-pink-50 transition shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Play Quest Again</span>
            </button>

            <button
              onClick={() => onNavigate && onNavigate("finale")}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 shadow-glow-pink hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              <span>NEXT: THE GRAND FINALE 🎆</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Footer for Quest Mode */}
      {!vaultUnlocked && (
        <div className="mt-8 flex items-center justify-between w-full max-w-xl">
          <button
            onClick={() => onNavigate && onNavigate("cake")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-pink-600 dark:text-slate-400 dark:hover:text-pink-300 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Cake</span>
          </button>
          <button
            onClick={() => onNavigate && onNavigate("finale")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-pink-600 hover:text-pink-700 dark:text-pink-300 transition"
          >
            <span>Skip to Grand Finale 🎆</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </section>
  );
}

