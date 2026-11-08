import React, { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, Trophy, Award, Sparkles, ArrowRight } from "lucide-react";
import { birthdayQuizQuestions } from "../data/gamesData";
import { sound } from "../utils/audioSynth";
import { triggerConfetti, triggerGrandFireworks } from "../utils/confetti";

export default function BirthdayQuiz({ onScoreUpdate, unlockAchievement, onLevelComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQ = birthdayQuizQuestions[currentIndex];

  const handleSelectOption = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correct;
    if (isCorrect) {
      sound.playChime();
      setScore((s) => s + 10);
    } else {
      sound.playWhack();
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIndex < birthdayQuizQuestions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Completed!
      setIsCompleted(true);
      sound.playSuccessFanfare();
      triggerGrandFireworks(3000);
      if (unlockAchievement) unlockAchievement("quiz_expert");
      if (onScoreUpdate) onScoreUpdate(score + (selectedOption === currentQ.correct ? 10 : 0));
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCompleted(false);
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4 sm:p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-pink-200 dark:border-pink-900/60 shadow-xl">
      {!isCompleted ? (
        <>
          {/* Progress Header */}
          <div className="w-full flex items-center justify-between mb-4 px-2">
            <span className="text-xs font-bold text-pink-600 dark:text-pink-300">
              Question {currentIndex + 1} of {birthdayQuizQuestions.length}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Score: {score} pts
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-pink-100 dark:bg-slate-800 h-2 rounded-full mb-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-full transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / birthdayQuizQuestions.length) * 100}%`,
              }}
            />
          </div>

          {/* Question Card */}
          <div className="w-full mb-6 text-center">
            <h3 className="font-display font-bold text-lg sm:text-xl text-slate-800 dark:text-white leading-relaxed">
              {currentQ.question}
            </h3>
          </div>

          {/* Multiple Choice Options */}
          <div className="w-full space-y-2.5 mb-6">
            {currentQ.options.map((option, idx) => {
              let btnStyle =
                "bg-white dark:bg-slate-800 border-pink-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-pink-300 hover:bg-pink-50 dark:hover:bg-slate-700";

              if (isAnswered) {
                if (idx === currentQ.correct) {
                  btnStyle =
                    "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-semibold";
                } else if (idx === selectedOption) {
                  btnStyle =
                    "bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-200";
                } else {
                  btnStyle = "opacity-40 border-slate-200 dark:border-slate-800";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full p-3.5 rounded-2xl border-2 text-left text-xs sm:text-sm transition flex items-center justify-between gap-3 shadow-sm ${btnStyle}`}
                >
                  <span className="leading-snug">{option}</span>
                  {isAnswered && idx === currentQ.correct && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  )}
                  {isAnswered && idx === selectedOption && idx !== currentQ.correct && (
                    <XCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Answer Feedback & Next Button */}
          {isAnswered && (
            <div className="w-full p-4 rounded-2xl bg-pink-50 dark:bg-slate-800/80 border border-pink-200 dark:border-slate-700 text-center animate-fadeIn">
              <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">
                {currentQ.explanation}
              </p>
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 transition shadow-glow-pink"
              >
                <span>
                  {currentIndex === birthdayQuizQuestions.length - 1
                    ? "See Final Results 🏆"
                    : "Next Question"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        /* Final Quiz Results Screen */
        <div className="w-full text-center p-6 animate-fadeIn">
          <div className="text-5xl mb-3">👑 🎓 🌟</div>
          <h3 className="font-display font-bold text-2xl text-slate-800 dark:text-white mb-1">
            Quiz Complete!
          </h3>
          <p className="text-sm font-semibold text-pink-600 dark:text-pink-300 mb-4">
            Total Score: {score} / 100 Points!
          </p>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-100 via-purple-100 to-amber-100 dark:from-pink-950/50 dark:via-purple-950/50 dark:to-slate-800 border border-pink-200 dark:border-pink-800 mb-6">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1">
              Official Assessment:
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Nikki has officially passed the Birthday Universe Examination with flying colors! Your charm, sweetness, and brilliance are unmatched.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-pink-200 dark:border-slate-700 hover:bg-pink-50 transition shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>

            {onLevelComplete && (
              <button
                onClick={onLevelComplete}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-glow-pink hover:scale-105 transition cursor-pointer"
              >
                <span>Complete Arcade Quest 🏆</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

