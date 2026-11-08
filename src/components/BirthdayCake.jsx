import React, { useState } from "react";
import { Sparkles, Heart, RotateCcw, Flame, Wind, Stars, ArrowRight, ArrowLeft } from "lucide-react";
import { birthdayData } from "../data/birthdayData";
import { sound } from "../utils/audioSynth";
import { triggerConfetti, triggerGrandFireworks, triggerHeartConfetti } from "../utils/confetti";

export default function BirthdayCake({ unlockAchievement, onNavigate }) {
  const [litCandles, setLitCandles] = useState([true, true, true, true, true]);
  const [wishMade, setWishMade] = useState(false);

  const litCount = litCandles.filter(Boolean).length;

  const extinguishCandle = (index) => {
    if (!litCandles[index]) return;

    sound.playCandleBlow();
    const next = [...litCandles];
    next[index] = false;
    setLitCandles(next);

    // If this was the last candle
    if (next.every((c) => !c)) {
      triggerWishCelebration();
    }
  };

  const blowAllCandles = () => {
    sound.playCandleBlow();
    setLitCandles([false, false, false, false, false]);
    triggerWishCelebration();
  };

  const triggerWishCelebration = () => {
    setWishMade(true);
    sound.playSuccessFanfare();
    triggerHeartConfetti();
    triggerConfetti({ particleCount: 120, spread: 100 });
    triggerGrandFireworks(4000);
    unlockAchievement("candle_blower");
  };

  const relightCandles = () => {
    sound.playSparkle();
    setLitCandles([true, true, true, true, true]);
    setWishMade(false);
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-8 max-w-4xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8 z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-spin-slow" />
          <span>Interactive 3D Birthday Cake</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-800 dark:text-white">
          Blow Out The Candles, Nikki! 🎂✨
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          {wishMade
            ? "Your birthday wish has taken flight to the stars!"
            : "Click on each glowing flame or use the button below to blow them all out!"}
        </p>
      </div>

      {/* The 3D Multi-Layer Cake Container */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-md my-4 z-10 select-none">
        {/* Glowing Aura underneath cake */}
        <div className="absolute inset-0 bg-pink-300/40 dark:bg-purple-900/40 rounded-full blur-3xl pointer-events-none scale-125" />

        {/* Candles Row on top tier */}
        <div className="flex items-end justify-center gap-4 sm:gap-6 mb-[-6px] z-20">
          {litCandles.map((isLit, idx) => (
            <div
              key={idx}
              onClick={() => extinguishCandle(idx)}
              className="flex flex-col items-center cursor-pointer group"
              title={isLit ? "Click to blow out this candle!" : "Extinguished"}
            >
              {/* Flame */}
              <div className="h-9 flex items-center justify-center">
                {isLit ? (
                  <div className="relative flex items-center justify-center animate-bounce-subtle">
                    {/* Outer warm glow */}
                    <div className="absolute w-7 h-7 rounded-full bg-amber-400/60 blur-md animate-pulse" />
                    {/* Flame SVG */}
                    <div className="w-4 h-6 rounded-full bg-gradient-to-t from-rose-500 via-amber-400 to-yellow-200 shadow-glow-gold transition-all duration-300 group-hover:scale-125" />
                  </div>
                ) : (
                  /* Smoke puff when blown out */
                  <div className="text-xs text-slate-400 animate-float-slow opacity-60">
                    💨
                  </div>
                )}
              </div>

              {/* Candle Body */}
              <div className="w-3 sm:w-3.5 h-12 sm:h-14 rounded-t-sm bg-gradient-to-b from-white via-pink-100 to-pink-200 border border-pink-300 shadow-sm relative overflow-hidden">
                {/* Spiral decorative stripes */}
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_3px,rgba(255,105,180,0.4)_3px,rgba(255,105,180,0.4)_6px)]" />
              </div>
            </div>
          ))}
        </div>

        {/* Tier 1 (Top Tier) */}
        <div className="relative z-10 w-44 sm:w-52 h-16 sm:h-18 rounded-2xl bg-gradient-to-b from-pink-200 via-rose-100 to-pink-300 border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
          {/* Dripping Frosting */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-white/90 rounded-b-xl shadow-inner flex justify-around">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="w-3 h-3 bg-white rounded-full -mb-1" />
            ))}
          </div>
          {/* Strawberries / Pearls */}
          <div className="flex gap-4 text-sm mt-3">
            <span>🍓</span>
            <span>💖</span>
            <span>🍓</span>
          </div>
        </div>

        {/* Tier 2 (Middle Tier) */}
        <div className="relative z-0 w-60 sm:w-72 h-18 sm:h-20 rounded-2xl bg-gradient-to-b from-purple-200 via-pink-100 to-rose-200 border-2 border-white shadow-lg flex items-center justify-center overflow-hidden -mt-2">
          {/* Frosting Drips */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-white/90 rounded-b-xl shadow-inner flex justify-around">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="w-4 h-4 bg-white rounded-full -mb-1.5" />
            ))}
          </div>
          <span className="font-magical text-2xl sm:text-3xl text-pink-600 font-bold mt-3">
            Happy Birthday Nikki
          </span>
        </div>

        {/* Tier 3 (Base Tier) */}
        <div className="relative z-0 w-72 sm:w-88 h-20 sm:h-24 rounded-2xl bg-gradient-to-b from-rose-300 via-pink-200 to-purple-300 border-2 border-white shadow-xl flex items-center justify-center overflow-hidden -mt-2">
          {/* Rose Gold Frosting Garland */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-white/90 rounded-b-xl shadow-inner flex justify-around">
            {Array.from({ length: 11 }).map((_, i) => (
              <div key={i} className="w-4 h-4 bg-white rounded-full -mb-1.5" />
            ))}
          </div>
          <div className="flex gap-4 text-lg mt-4">
            <span>🌸</span>
            <span>👑</span>
            <span>✨</span>
            <span>👑</span>
            <span>🌸</span>
          </div>
        </div>

        {/* Cake Stand / Pedestal */}
        <div className="w-80 sm:w-96 h-5 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 rounded-full shadow-2xl border-2 border-amber-300 -mt-1" />
        <div className="w-36 h-4 bg-gradient-to-r from-amber-300 to-yellow-400 rounded-b-xl shadow-lg" />
      </div>

      {/* Action Controls */}
      <div className="mt-6 z-10 text-center">
        {!wishMade ? (
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={blowAllCandles}
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 shadow-glow-pink hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Wind className="w-4 h-4" />
              <span>{birthdayData.cake.buttonText}</span>
            </button>
          </div>
        ) : (
          <button
            onClick={relightCandles}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-pink-200 dark:border-slate-700 hover:bg-pink-50 transition shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Relight Candles For Another Wish</span>
          </button>
        )}
      </div>

      {/* Wish Celebration Banner */}
      {wishMade && (
        <div className="w-full max-w-xl mt-6 p-6 rounded-3xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-2 border-pink-300 dark:border-pink-800 text-center shadow-2xl animate-fadeIn z-10">
          <div className="text-3xl mb-1">🎉 🕯️ ⭐ 💖</div>
          <h3 className="font-magical text-3xl sm:text-4xl text-pink-600 dark:text-pink-300 font-bold mb-2">
            Make A Wish, Nikki! ❤️
          </h3>
          <p className="font-display font-medium text-base sm:text-lg text-slate-800 dark:text-slate-100 mb-2">
            "{birthdayData.cake.wishMadeText}"
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-6">
            Flavor of the day: {birthdayData.cake.cakeFlavors}
          </p>

          {/* Next Button */}
          <div className="pt-4 border-t border-pink-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={relightCandles}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-pink-200 dark:border-slate-700 hover:bg-pink-50 transition shadow-sm cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Relight Candles</span>
            </button>

            <button
              onClick={() => onNavigate && onNavigate("treasure")}
              className="w-full sm:w-auto group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 shadow-glow-pink hover:scale-105 active:scale-95 transition cursor-pointer"
            >
              <span>NEXT: SECRET QUEST 🗺️</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Footer when candles still lit */}
      {!wishMade && (
        <div className="mt-8 flex items-center justify-between w-full max-w-sm z-10">
          <button
            onClick={() => onNavigate && onNavigate("letter")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-pink-600 dark:text-slate-400 dark:hover:text-pink-300 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Letter</span>
          </button>
          <button
            onClick={() => onNavigate && onNavigate("treasure")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-pink-600 hover:text-pink-700 dark:text-pink-300 transition"
          >
            <span>Skip to Quest 🗺️</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </section>
  );
}

