import React, { useState } from "react";
import { Sparkles, Heart, Award, ArrowRight, ArrowLeft, RotateCcw, CheckCircle2, ShieldCheck, Stars } from "lucide-react";
import { birthdayData } from "../data/birthdayData";
import { sound } from "../utils/audioSynth";
import { triggerConfetti, triggerGrandFireworks } from "../utils/confetti";

export default function SpecialPersonality({ unlockAchievement, onNavigate }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTraits, setSelectedTraits] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const { questions, resultCertificate, title, subtitle } = birthdayData.personalityQuiz;
  const currentQ = questions[currentStep];

  const handleSelectOption = (option) => {
    sound.playChime();
    const updatedTraits = [...selectedTraits, option.trait];
    setSelectedTraits(updatedTraits);

    if (currentStep < questions.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      // Finished personality test!
      setIsCompleted(true);
      sound.playSuccessFanfare();
      triggerGrandFireworks(3000);
      triggerConfetti({ particleCount: 100 });
      if (unlockAchievement) unlockAchievement("enter_universe");
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentStep(0);
    setSelectedTraits([]);
    setIsCompleted(false);
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-spin-slow" />
          <span>Interactive Soul Analysis</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-800 dark:text-white">
          {title}
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          {subtitle}
        </p>
      </div>

      {!isCompleted ? (
        /* Question Card */
        <div className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-pink-200 dark:border-pink-900/60 rounded-3xl p-6 sm:p-10 shadow-2xl animate-fadeIn">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-pink-600 dark:text-pink-300">
              Question {currentStep + 1} of {questions.length}
            </span>
            <span className="text-xs text-purple-600 dark:text-purple-300 font-semibold">
              ✨ Discovering Your Glow
            </span>
          </div>

          <div className="w-full bg-pink-100 dark:bg-slate-800 h-2 rounded-full mb-8 overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 h-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-800 dark:text-white text-center mb-8 leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Options List */}
          <div className="space-y-3.5">
            {currentQ.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(option)}
                className="w-full p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-pink-100 dark:border-slate-700 hover:border-pink-400 dark:hover:border-pink-500 hover:bg-pink-50/60 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold transition-all flex items-center justify-between gap-3 shadow-sm hover:scale-[1.01] active:scale-[0.99] group text-left cursor-pointer"
              >
                <span>{option.text}</span>
                <ArrowRight className="w-4 h-4 text-pink-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Result Certificate Card */
        <div className="w-full bg-gradient-to-b from-amber-50 via-pink-50 to-purple-50 dark:from-slate-900 dark:via-purple-950/40 dark:to-slate-900 border-4 border-amber-300 dark:border-amber-700 rounded-3xl p-6 sm:p-10 shadow-2xl text-center relative overflow-hidden animate-fadeIn">
          {/* Certificate Watermark / Star badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-200/80 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 text-xs font-extrabold uppercase tracking-widest mb-4 border border-amber-300 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>{resultCertificate.title}</span>
          </div>

          <h3 className="font-magical text-5xl sm:text-6xl text-pink-600 dark:text-pink-300 mb-2">
            Presented to Nikki ❤️
          </h3>

          <div className="my-4 inline-block px-4 py-2 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-pink-200 dark:border-pink-800 shadow-inner">
            <span className="font-display font-bold text-lg sm:text-xl text-purple-600 dark:text-purple-300">
              Verdict: {resultCertificate.verdict}
            </span>
          </div>

          <p className="font-handwriting text-xl sm:text-2xl text-slate-700 dark:text-pink-100 max-w-lg mx-auto mb-6 leading-relaxed">
            "{resultCertificate.summary}"
          </p>

          {/* Personality Traits Discovered Pills */}
          <div className="mb-8">
            <span className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block mb-2.5">
              Identified Core Traits:
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {selectedTraits.map((trait, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-200 text-xs font-bold shadow-sm"
                >
                  ✦ {trait}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-pink-200 dark:border-slate-700 hover:bg-pink-50 transition shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Experience</span>
            </button>

            <button
              onClick={() => onNavigate && onNavigate("letter")}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold text-sm text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 shadow-glow-pink hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              <span>NEXT: SECRET LETTER 💌</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Footer */}
      {!isCompleted && (
        <div className="mt-8 flex items-center justify-between w-full max-w-xl">
          <button
            onClick={() => onNavigate && onNavigate("memories")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-pink-600 dark:text-slate-400 dark:hover:text-pink-300 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Memories</span>
          </button>
          <button
            onClick={() => onNavigate && onNavigate("letter")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-pink-600 hover:text-pink-700 dark:text-pink-300 transition"
          >
            <span>Skip to Secret Letter 💌</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </section>
  );
}

