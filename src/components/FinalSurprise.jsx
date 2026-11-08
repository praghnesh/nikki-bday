import React, { useEffect, useState } from "react";
import { Sparkles, Heart, RotateCcw, PartyPopper, Stars, Send, Share2 } from "lucide-react";
import { birthdayData } from "../data/birthdayData";
import { sound } from "../utils/audioSynth";
import { triggerConfetti, triggerGrandFireworks, triggerHeartConfetti } from "../utils/confetti";

export default function FinalSurprise({ onReplay, unlockAchievement }) {
  const [hugSent, setHugSent] = useState(false);
  const { headline, subheadline, emotionalTribute, wishesList, replayButton, shareLoveButton } =
    birthdayData.finalSurprise;

  useEffect(() => {
    // Start continuous fireworks & celebration
    sound.playSuccessFanfare();
    triggerGrandFireworks(6000);
    triggerHeartConfetti();
    unlockAchievement("grand_finale");

    const fireworkInterval = setInterval(() => {
      triggerConfetti({
        particleCount: 40,
        spread: 120,
        origin: { x: Math.random(), y: Math.random() * 0.5 },
      });
    }, 1800);

    return () => clearInterval(fireworkInterval);
  }, []);

  const handleSendHug = () => {
    sound.playSparkle();
    sound.playPop();
    triggerHeartConfetti();
    setHugSent(true);
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-12 max-w-4xl mx-auto overflow-hidden text-center">
      {/* Background Radiance */}
      <div className="absolute inset-0 bg-gradient-to-b from-pink-300/20 via-purple-300/20 to-amber-200/20 rounded-full blur-3xl pointer-events-none scale-150 animate-pulse-glow" />

      {/* Main Glass Finale Card */}
      <div className="relative z-10 w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-2 border-pink-300/80 dark:border-pink-800/80 rounded-3xl p-8 sm:p-14 shadow-2xl animate-fadeIn">
        {/* Sparkle Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-950/70 dark:to-purple-950/70 border border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-300 text-xs sm:text-sm font-bold mb-6 shadow-sm">
          <PartyPopper className="w-4 h-4 text-pink-500 animate-bounce" />
          <span>The Grand Finale Celebration</span>
          <Stars className="w-4 h-4 text-purple-500 animate-spin-slow" />
        </div>

        {/* Grand Headline with animated gradient & typography */}
        <h1 className="font-magical text-5xl sm:text-7xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 mb-4 drop-shadow-sm leading-tight py-2">
          {headline}
        </h1>

        <p className="font-display italic text-xl sm:text-2xl text-purple-600 dark:text-pink-200 font-semibold mb-6">
          "{subheadline}"
        </p>

        {/* Emotional Tribute */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-800/80 border border-pink-100 dark:border-slate-700 shadow-inner max-w-2xl mx-auto mb-8">
          <p className="font-handwriting text-2xl sm:text-3xl text-slate-800 dark:text-pink-100 leading-relaxed">
            "{emotionalTribute}"
          </p>
        </div>

        {/* 4 Golden Wishes for Nikki Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto mb-10">
          {wishesList.map((wish, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 dark:from-slate-800 dark:to-slate-800/60 border border-pink-200 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 shadow-sm"
            >
              <Heart className="w-4 h-4 text-pink-500 fill-pink-500 flex-shrink-0" />
              <span>{wish}</span>
            </div>
          ))}
        </div>

        {/* Interactive Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleSendHug}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-glow-pink hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Heart className={`w-4 h-4 fill-white ${hugSent ? "animate-ping" : ""}`} />
            <span>{hugSent ? "Virtual Hug Sent With Love! 🫂💖" : shareLoveButton}</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onReplay();
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border-2 border-pink-200 dark:border-slate-700 hover:bg-pink-50 transition shadow-sm cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{replayButton}</span>
          </button>
        </div>
      </div>
    </section>
  );
}

