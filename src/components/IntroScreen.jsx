import React, { useState, useEffect } from "react";
import { Sparkles, Heart, Stars, ChevronRight, Music, Clock } from "lucide-react";
import { birthdayData } from "../data/birthdayData";
import { sound } from "../utils/audioSynth";
import { triggerHeartConfetti, triggerConfetti } from "../utils/confetti";

export default function IntroScreen({ onEnterUniverse, unlockAchievement }) {
  const [timePassed, setTimePassed] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Celebration timer from birthday date
    const targetDate = new Date(birthdayData.recipient.birthdayDate).getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = Math.abs(now - targetDate);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimePassed({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleEnter = () => {
    sound.playSparkle();
    sound.startBgm();
    triggerHeartConfetti();
    triggerConfetti({ particleCount: 100, spread: 100 });
    unlockAchievement("enter_universe");
    onEnterUniverse();
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Radiant Background Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-tr from-pink-300/40 to-purple-300/30 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-br from-peach-300/40 via-lavender-300/30 to-pink-200/40 rounded-full blur-3xl pointer-events-none animate-float-slow" />

      {/* Main Glass Card */}
      <div className="relative z-10 max-w-3xl w-full mx-auto text-center p-8 sm:p-12 md:p-16 rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-pink-200/60 dark:border-pink-900/50 shadow-2xl transition-all">
        {/* Floating Crown / Sparkle badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-950/60 dark:to-purple-950/60 border border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
          <Sparkles className="w-4 h-4 text-pink-500 animate-spin-slow" />
          <span>A Magical Digital Experience Dedicated To Nikki</span>
          <Stars className="w-4 h-4 text-purple-500" />
        </div>

        {/* Cinematic Headline */}
        <h1 className="font-magical text-5xl sm:text-7xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-rose-500 mb-6 drop-shadow-sm py-2">
          {birthdayData.intro.greeting}
        </h1>

        {/* Subheading & Emotional Message */}
        <p className="font-display italic text-xl sm:text-2xl md:text-3xl text-slate-700 dark:text-pink-100 mb-4 font-medium leading-relaxed">
          "{birthdayData.intro.subheading}"
        </p>

        <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
          {birthdayData.intro.body}
        </p>

        {/* Countdown / Celebration Live Pill */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto mb-10">
          {[
            { label: "Days of Magic", val: timePassed.days },
            { label: "Hours", val: timePassed.hours },
            { label: "Minutes", val: timePassed.minutes },
            { label: "Seconds", val: timePassed.seconds },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-pink-100 dark:border-slate-700 shadow-sm"
            >
              <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                {String(item.val).padStart(2, "0")}
              </div>
              <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mt-1">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <p className="font-display font-semibold text-lg sm:text-xl text-pink-600 dark:text-pink-300 mb-8">
          {birthdayData.intro.question}
        </p>

        {/* Glowing Interactive Enter Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleEnter}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-base sm:text-lg text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 shadow-glow-pink hover:shadow-glow-purple hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <Heart className="w-5 h-5 text-white fill-white group-hover:scale-125 transition-transform" />
            <span>{birthdayData.intro.buttonText}</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Romantic Footer Note */}
        <div className="mt-10 pt-6 border-t border-pink-100/60 dark:border-slate-800 text-xs sm:text-sm text-slate-500 dark:text-slate-400 italic flex items-center justify-center gap-2">
          <span>🎧 Best experienced with sound turned on</span>
          <span>•</span>
          <span>Handcrafted with love for Nikki ❤️</span>
        </div>
      </div>
    </div>
  );
}

