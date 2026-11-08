import React, { useState } from "react";
import { Sparkles, Gift, Heart, Stars, RotateCcw, PartyPopper, ArrowRight, ArrowLeft } from "lucide-react";
import { birthdayData } from "../data/birthdayData";
import { sound } from "../utils/audioSynth";
import { triggerConfetti, triggerGrandFireworks, triggerHeartConfetti } from "../utils/confetti";

export default function GiftBox({ unlockAchievement, onNavigate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [balloons, setBalloons] = useState([]);

  const handleOpenGift = () => {
    if (isOpen) return;
    setIsOpen(true);
    sound.playSparkle();
    sound.playSuccessFanfare();
    triggerHeartConfetti();
    triggerConfetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
    triggerGrandFireworks(2500);

    // Spawn floating balloons
    const colors = ["#FF69B4", "#BA55D3", "#FFD700", "#FF6347", "#00CED1", "#FFB6C1"];
    const newBalloons = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: 15 + Math.random() * 70,
      color: colors[i % colors.length],
      size: 40 + Math.random() * 25,
      delay: Math.random() * 0.4,
    }));
    setBalloons(newBalloons);

    unlockAchievement("gift_unboxed");
  };

  const handleReset = () => {
    sound.playClick();
    setIsOpen(false);
    setBalloons([]);
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Floating upward balloons on open */}
      {isOpen &&
        balloons.map((b) => (
          <div
            key={b.id}
            className="fixed bottom-0 pointer-events-none z-30 transition-all duration-1000 ease-out"
            style={{
              left: `${b.x}%`,
              animation: `flyUp 4s ease-out forwards ${b.delay}s`,
            }}
          >
            <div
              className="rounded-full shadow-lg relative flex items-center justify-center text-xs text-white font-bold opacity-90"
              style={{
                width: `${b.size}px`,
                height: `${b.size * 1.25}px`,
                backgroundColor: b.color,
                borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
              }}
            >
              ❤️
              {/* String */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-16 bg-slate-400/60" />
            </div>
          </div>
        ))}

      {/* Header Info */}
      <div className="text-center max-w-2xl mx-auto mb-8 z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-300 text-xs font-semibold mb-3">
          <Gift className="w-3.5 h-3.5 text-pink-500 animate-bounce-subtle" />
          <span>Interactive 3D Gift Box</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-800 dark:text-white">
          A Very Special Surprise for Nikki 🎀
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
          {isOpen
            ? "Your birthday wishes have arrived from the stars! ✨"
            : "Untie the ribbon and see what wonders are waiting for you inside..."}
        </p>
      </div>

      {/* 3D Gift Box Container */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-2xl z-10">
        {/* The 3D Box Illustration */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mb-8 perspective-[1000px]">
          {/* Glowing Aura */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-700 blur-3xl pointer-events-none ${
              isOpen
                ? "bg-gradient-to-r from-pink-400/50 via-purple-400/50 to-amber-300/60 scale-150 animate-pulse"
                : "bg-pink-300/30 scale-90"
            }`}
          />

          {/* Box Body */}
          <div
            onClick={!isOpen ? handleOpenGift : undefined}
            className={`relative w-full h-full cursor-pointer transition-transform duration-700 select-none ${
              !isOpen ? "hover:scale-105 active:scale-95" : ""
            }`}
          >
            {/* Box Base */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 sm:w-56 h-36 sm:h-40 bg-gradient-to-br from-pink-400 via-rose-400 to-purple-500 rounded-2xl shadow-2xl border-4 border-pink-300/60 flex items-center justify-center overflow-hidden">
              {/* Vertical Ribbon */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 shadow-md" />
              {/* Horizontal Ribbon */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-8 bg-gradient-to-b from-amber-300 via-yellow-200 to-amber-400 shadow-md" />
              {/* Sparkle badge in center */}
              <div className="z-10 bg-white/90 p-2.5 rounded-full shadow-lg border border-pink-200">
                <Heart className="w-6 h-6 text-pink-500 fill-pink-500 animate-pulse" />
              </div>
            </div>

            {/* Box Lid with 3D Flip Open Animation */}
            <div
              className={`absolute top-10 sm:top-8 left-1/2 -translate-x-1/2 w-52 sm:w-60 h-16 sm:h-18 bg-gradient-to-r from-rose-400 via-pink-400 to-purple-500 rounded-2xl shadow-xl border-4 border-pink-200/80 transition-all duration-700 origin-bottom-left ${
                isOpen
                  ? "-translate-y-24 -rotate-45 opacity-80 scale-95"
                  : "translate-y-0 rotate-0"
              }`}
            >
              {/* Lid Ribbon */}
              <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400" />
              {/* Ribbon Bow on Lid */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-amber-300 bg-amber-200 rotate-45 -mr-2 shadow-md" />
                <div className="w-8 h-8 rounded-full border-4 border-amber-300 bg-amber-200 -rotate-45 -ml-2 shadow-md" />
                <div className="absolute w-5 h-5 rounded-full bg-gradient-to-br from-amber-300 to-yellow-500 shadow-inner" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {!isOpen ? (
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleOpenGift}
              className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full font-bold text-base text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 shadow-glow-pink hover:shadow-glow-purple hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-5 h-5 animate-spin-slow text-yellow-200" />
              <span>{birthdayData.giftBox.buttonText}</span>
              <PartyPopper className="w-5 h-5 group-hover:scale-125 transition-transform" />
            </button>

            {/* Direct Skip to Next */}
            <button
              onClick={() => onNavigate && onNavigate("arcade")}
              className="inline-flex items-center gap-2 text-xs font-semibold text-pink-600 dark:text-pink-300 hover:text-pink-700 dark:hover:text-pink-200 transition cursor-pointer mt-1"
            >
              <span>Or skip directly to Next: Game Arcade 🎮</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-pink-200 dark:border-slate-700 hover:bg-pink-50 dark:hover:bg-slate-700 transition shadow-sm mb-6 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Pack Surprise Back Into Box</span>
          </button>
        )}

        {/* Revealed Content Card */}
        {isOpen && (
          <div className="w-full mt-4 p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-pink-200 dark:border-pink-800/60 shadow-2xl animate-fadeIn">
            {/* Title */}
            <div className="flex items-center justify-center gap-2 text-pink-600 dark:text-pink-300 font-display font-bold text-2xl text-center mb-6">
              <Stars className="w-5 h-5 text-yellow-500 animate-spin-slow" />
              <span>{birthdayData.giftBox.title}</span>
              <Stars className="w-5 h-5 text-yellow-500 animate-spin-slow" />
            </div>

            {/* Gift Items Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {birthdayData.giftBox.giftItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-gradient-to-b from-pink-50 to-purple-50 dark:from-slate-800 dark:to-slate-800/60 border border-pink-100 dark:border-slate-700 text-center hover:scale-105 transition-transform"
                >
                  <div className="text-3xl mb-1.5">{item.icon}</div>
                  <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100">
                    {item.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* Birthday Wishes List */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-pink-500 dark:text-pink-400 text-center">
                ✨ Star-Sealed Birthday Wishes ✨
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {birthdayData.giftBox.wishes.map((wish, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-pink-100 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-200 flex items-start gap-2.5 shadow-sm"
                  >
                    <span className="text-pink-500 font-bold mt-0.5">✦</span>
                    <span className="leading-relaxed">{wish}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hidden Message Golden Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 via-pink-50 to-purple-50 dark:from-amber-950/40 dark:via-pink-950/40 dark:to-purple-950/40 border-2 border-amber-200 dark:border-amber-800 text-center shadow-inner">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-widest mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Special Hidden Secret Message</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <p className="font-handwriting text-xl sm:text-2xl text-slate-800 dark:text-pink-100 font-bold leading-relaxed">
                "{birthdayData.giftBox.hiddenMessage}"
              </p>
            </div>

            {/* ✨ NEXT BUTTON REQUESTED BY USER RIGHT HERE ✨ */}
            <div className="mt-8 pt-6 border-t border-pink-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => onNavigate && onNavigate("intro")}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-pink-200 dark:border-slate-700 hover:bg-pink-50 dark:hover:bg-slate-700 transition shadow-sm cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Intro</span>
              </button>

              <button
                onClick={() => onNavigate && onNavigate("arcade")}
                className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 shadow-glow-pink hover:shadow-glow-purple hover:scale-105 active:scale-95 transition-all cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <span>NEXT: BIRTHDAY ARCADE (12 GAMES) 🎮</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes flyUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0.95; }
          100% { transform: translateY(-110vh) rotate(20deg); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
