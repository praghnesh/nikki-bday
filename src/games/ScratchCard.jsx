import React, { useState, useRef, useEffect } from "react";
import { Sparkles, RotateCcw, Heart, Award, ArrowRight, Timer } from "lucide-react";
import { scratchCards } from "../data/gamesData";
import { sound } from "../utils/audioSynth";
import { triggerConfetti } from "../utils/confetti";

export default function ScratchCard({ onScoreUpdate, unlockAchievement, onLevelComplete }) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);

  const card = scratchCards[currentCardIndex];

  // 30s Countdown timer
  useEffect(() => {
    if (isRevealed) return;
    if (timeLeft <= 0) {
      // Auto reveal when 30s expires
      setIsRevealed(true);
      sound.playChime();
      return;
    }

    const t = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(t);
  }, [isRevealed, timeLeft]);

  // Draw shimmering scratch foil on canvas
  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = (canvas.width = canvas.offsetWidth || 340);
    const height = (canvas.height = canvas.offsetHeight || 200);

    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#E0C3FC");
    grad.addColorStop(0.3, "#FFD1DC");
    grad.addColorStop(0.7, "#FFE5B4");
    grad.addColorStop(1, "#D8BFD8");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✨ SCRATCH WITH FINGER OR MOUSE ✨", width / 2, height / 2 - 12);
    ctx.font = "12px sans-serif";
    ctx.fillText("Scratch to reveal Nikki's secret wish! (30s)", width / 2, height / 2 + 14);

    setIsRevealed(false);
    setTimeLeft(30);
  };

  useEffect(() => {
    initCanvas();
  }, [currentCardIndex]);

  const scratch = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    if (Math.random() > 0.6) {
      sound.playScratch();
    }

    checkPercentage();
  };

  const checkPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    const imgData = ctx.getImageData(0, 0, width, height);
    const pixels = imgData.data;
    let transparentCount = 0;
    const step = 40;

    for (let i = 3; i < pixels.length; i += step * 4) {
      if (pixels[i] === 0) transparentCount++;
    }

    const totalSampled = pixels.length / (step * 4);
    const percent = transparentCount / totalSampled;

    if (percent > 0.45 && !isRevealed) {
      setIsRevealed(true);
      sound.playSuccessFanfare();
      triggerConfetti({ particleCount: 70 });
      if (unlockAchievement) unlockAchievement("enter_universe");
      if (onScoreUpdate) onScoreUpdate(40);
    }
  };

  const handlePointerDown = (e) => {
    isDrawingRef.current = true;
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    if (clientX && clientY) scratch(clientX, clientY);
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current) return;
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    const clientY = e.clientY || e.touches?.[0]?.clientY;
    if (clientX && clientY) scratch(clientX, clientY);
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  const handleNextCard = () => {
    sound.playSparkle();
    setCurrentCardIndex((c) => (c + 1) % scratchCards.length);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto p-4 sm:p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-pink-200 dark:border-pink-900/60 shadow-xl">
      {/* Top Header with Level & 30s Timer */}
      <div className="w-full flex items-center justify-between mb-3 px-2">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300 text-xs font-bold">
            Level {currentCardIndex + 1} of {scratchCards.length}
          </span>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            {card.title}
          </span>
        </div>

        {/* 30 Seconds Timer */}
        <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
          <Timer className="w-4 h-4 text-purple-500" />
          <span>{timeLeft}s</span>
        </div>

        <button
          onClick={initCanvas}
          className="p-1.5 rounded-full hover:bg-pink-100 dark:hover:bg-slate-800 text-pink-600 dark:text-pink-300 transition cursor-pointer"
          title="Re-scratch card"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* The Scratch Card Container */}
      <div className="relative w-full max-w-md h-56 sm:h-64 rounded-3xl overflow-hidden border-2 border-pink-300 dark:border-pink-800 shadow-xl select-none">
        {/* Hidden Content underneath the scratch foil */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-amber-50 dark:from-slate-800 dark:via-purple-950/40 dark:to-slate-800 p-6 flex flex-col items-center justify-center text-center">
          <div className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 text-[10px] font-extrabold uppercase tracking-widest mb-2 border border-amber-200">
            {card.badge}
          </div>
          <h4 className="font-display font-bold text-base sm:text-lg text-slate-800 dark:text-white mb-2">
            {card.hiddenTitle}
          </h4>
          <p className="font-handwriting text-lg sm:text-xl text-slate-700 dark:text-pink-100 leading-snug max-w-xs">
            "{card.hiddenMessage}"
          </p>
        </div>

        {/* Scratch Canvas Foil overlay */}
        <canvas
          ref={canvasRef}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          className={`absolute inset-0 w-full h-full cursor-crosshair transition-opacity duration-700 ${
            isRevealed ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        />
      </div>

      {/* Bottom Switch Card button */}
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={onLevelComplete || handleNextCard}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 transition shadow-glow-pink cursor-pointer"
        >
          <span>
            {onLevelComplete ? "Proceed to Level 8 (Simon Says) 🚀" : currentCardIndex < scratchCards.length - 1
              ? `Advance to Level ${currentCardIndex + 2} 🚀`
              : "Replay Level 1 🔄"}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
        Scratch the foil within 30 seconds to uncover Nikki's secret birthday fortune!
      </p>
    </div>
  );
}
