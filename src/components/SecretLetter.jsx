import React, { useState, useEffect } from "react";
import { Mail, Sparkles, Heart, RotateCcw, Feather, ArrowRight, ArrowLeft } from "lucide-react";
import { birthdayData } from "../data/birthdayData";
import { sound } from "../utils/audioSynth";
import { triggerHeartConfetti } from "../utils/confetti";

export default function SecretLetter({ unlockAchievement, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [displayedParagraphs, setDisplayedParagraphs] = useState([]);
  const letter = birthdayData.secretLetter;

  const handleOpenLetter = () => {
    if (isOpen) return;
    setIsOpen(true);
    sound.playSparkle();
    sound.playChime();
    triggerHeartConfetti();
    unlockAchievement("letter_opened");

    // Reveal paragraphs one by one smoothly
    letter.paragraphs.forEach((p, idx) => {
      setTimeout(() => {
        setDisplayedParagraphs((prev) => [...prev, p]);
      }, (idx + 1) * 600);
    });
  };

  const handleReset = () => {
    sound.playClick();
    setIsOpen(false);
    setDisplayedParagraphs([]);
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-300 text-xs font-semibold mb-3">
          <Mail className="w-3.5 h-3.5 text-pink-500 animate-bounce-subtle" />
          <span>Wax-Sealed Secret Envelope</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-800 dark:text-white">
          A Handwritten Letter for Nikki 💌
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          {isOpen
            ? "Written from the bottom of a heart that cares for you deeply."
            : "Click on the wax seal or button below to break the seal and unfold the letter."}
        </p>
      </div>

      {!isOpen ? (
        /* The Closed 3D Animated Envelope */
        <div className="flex flex-col items-center animate-fadeIn">
          <div
            onClick={handleOpenLetter}
            className="group relative w-72 h-52 sm:w-96 sm:h-64 bg-gradient-to-br from-pink-200 via-rose-100 to-purple-200 dark:from-slate-800 dark:via-purple-950/50 dark:to-slate-800 rounded-3xl shadow-2xl border-4 border-pink-300 dark:border-pink-800/80 cursor-pointer overflow-hidden flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-glow-pink"
          >
            {/* Envelope Flap Lines */}
            <div className="absolute top-0 left-0 right-0 h-0 border-t-[100px] sm:border-t-[120px] border-t-pink-300/80 dark:border-t-purple-900/60 border-l-[144px] sm:border-l-[192px] border-l-transparent border-r-[144px] sm:border-r-[192px] border-r-transparent group-hover:-translate-y-2 transition-transform duration-300" />

            {/* Glowing Golden Wax Seal */}
            <div className="relative z-10 w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-600 border-2 border-amber-200 shadow-xl flex items-center justify-center text-amber-950 font-display font-bold text-2xl group-hover:scale-110 transition-transform">
              <span className="font-magical text-3xl">{letter.waxSealText}</span>
              <div className="absolute -top-1 -right-1 text-xs animate-spin-slow">✨</div>
            </div>

            {/* Stamp on top right corner */}
            <div className="absolute top-4 right-4 w-12 h-14 bg-white/90 border-2 border-dashed border-pink-400 rounded-lg flex flex-col items-center justify-center text-xs font-bold text-pink-500 shadow-sm rotate-6">
              <span>❤️</span>
              <span className="text-[8px] font-mono">PAR AVION</span>
            </div>
          </div>

          <button
            onClick={handleOpenLetter}
            className="mt-8 inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 shadow-glow-pink hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Feather className="w-4 h-4 text-white" />
            <span>{letter.buttonOpen}</span>
            <Sparkles className="w-4 h-4 text-yellow-200 animate-spin-slow" />
          </button>
        </div>
      ) : (
        /* The Unfolded Handwritten Letter */
        <div className="w-full max-w-2xl bg-[#FFFDF8] dark:bg-slate-900 border-2 border-amber-200 dark:border-pink-900/60 rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden animate-fadeIn">
          {/* Paper texture margin lines */}
          <div className="absolute top-0 bottom-0 left-8 sm:left-12 w-0.5 bg-rose-200/50 dark:bg-pink-900/30" />

          {/* Floating heart decoration */}
          <div className="absolute top-6 right-6 text-2xl animate-float-slow">💌</div>

          {/* Date & Location */}
          <div className="text-right text-xs sm:text-sm font-handwriting text-slate-500 dark:text-pink-300 mb-6">
            {letter.date}
          </div>

          {/* Greeting */}
          <h3 className="font-handwriting text-2xl sm:text-3xl font-bold text-pink-700 dark:text-pink-300 mb-6 pl-4 sm:pl-8">
            {letter.greeting}
          </h3>

          {/* Paragraphs with staggered reveal */}
          <div className="space-y-4 pl-4 sm:pl-8">
            {displayedParagraphs.map((para, idx) => (
              <p
                key={idx}
                className="font-handwriting text-xl sm:text-2xl text-slate-800 dark:text-pink-100 leading-relaxed animate-fadeIn"
              >
                {para}
              </p>
            ))}
          </div>

          {/* Closing & Signature */}
          <div className="mt-8 pt-6 border-t border-amber-100 dark:border-slate-800 text-right pr-4 sm:pr-8">
            <p className="font-handwriting text-xl text-slate-600 dark:text-pink-200 italic">
              {letter.closing}
            </p>
            <p className="font-magical text-3xl sm:text-4xl text-pink-600 dark:text-pink-300 font-bold mt-1">
              {letter.signature}
            </p>
          </div>

          {/* Actions & Next Button */}
          <div className="mt-8 pt-6 border-t border-amber-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={handleReset}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-pink-200 dark:border-slate-700 hover:bg-pink-50 transition shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Fold Letter Back</span>
            </button>

            <button
              onClick={() => onNavigate && onNavigate("cake")}
              className="w-full sm:w-auto group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 shadow-glow-pink hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              <span>NEXT: BIRTHDAY CAKE 🎂</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Footer for Closed state */}
      {!isOpen && (
        <div className="mt-8 flex items-center justify-between w-full max-w-sm">
          <button
            onClick={() => onNavigate && onNavigate("special")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-pink-600 dark:text-slate-400 dark:hover:text-pink-300 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>
          <button
            onClick={() => onNavigate && onNavigate("cake")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-pink-600 hover:text-pink-700 dark:text-pink-300 transition"
          >
            <span>Skip to Cake 🎂</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </section>
  );
}

