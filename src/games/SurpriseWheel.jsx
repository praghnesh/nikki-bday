import React, { useState, useRef } from "react";
import { Sparkles, RotateCw, Trophy, Award, Gift } from "lucide-react";
import { wheelSlices } from "../data/gamesData";
import { sound } from "../utils/audioSynth";
import { triggerConfetti } from "../utils/confetti";

export default function SurpriseWheel({ onScoreUpdate, unlockAchievement }) {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const spinAudioTimerRef = useRef(null);

  const numSlices = wheelSlices.length;
  const sliceAngle = 360 / numSlices;

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedReward(null);

    // Pick random target slice
    const randomIndex = Math.floor(Math.random() * numSlices);
    // Extra full spins (5 to 8 rotations) + target slice angle offset
    const extraSpins = 5 + Math.floor(Math.random() * 3);
    // Pointer is at the top (270 degrees in standard math or 0 at top depending on orientation)
    // To land on slice i at top pointer:
    const targetSliceCenter = randomIndex * sliceAngle + sliceAngle / 2;
    // Current rotation modulo 360
    const currentRotMod = rotation % 360;
    // We want the final rotation (pointing at top = 270deg or 90deg offset)
    const targetRotation =
      rotation + (360 * extraSpins) + (360 - (targetSliceCenter % 360)) + 90;

    setRotation(targetRotation);

    // Play periodic tick sounds during spin
    let tickCount = 0;
    const maxTicks = 25;
    const tickInterval = setInterval(() => {
      sound.playWheelTick();
      tickCount++;
      if (tickCount >= maxTicks) {
        clearInterval(tickInterval);
      }
    }, 140);

    // After spin finishes (approx 4 seconds with CSS ease-out)
    setTimeout(() => {
      setIsSpinning(false);
      const landedItem = wheelSlices[randomIndex];
      setSelectedReward(landedItem);
      sound.playSuccessFanfare();
      triggerConfetti({ particleCount: 70, spread: 80 });

      if (unlockAchievement) unlockAchievement("wheel_spinner");
      if (onScoreUpdate) onScoreUpdate(50);
    }, 4200);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto p-4 sm:p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-pink-200 dark:border-pink-900/60 shadow-xl">
      {/* Title */}
      <div className="text-center mb-4">
        <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-800 dark:text-white">
          Nikki's Wheel of Fortune 🎡
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Give it a spin to unlock hilarious dares, royal passes, and sweet wishes!
        </p>
      </div>

      {/* Wheel Area */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center my-2 select-none">
        {/* Top Pointer Indicator */}
        <div className="absolute -top-3 z-30 flex flex-col items-center filter drop-shadow-md">
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[22px] border-t-pink-600 dark:border-t-pink-400" />
        </div>

        {/* The Rotating Wheel */}
        <div
          className="relative w-full h-full rounded-full border-4 border-amber-300 shadow-2xl overflow-hidden"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? "transform 4s cubic-bezier(0.15, 0.9, 0.2, 1)" : "none",
          }}
        >
          {/* SVG Slices */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {wheelSlices.map((slice, index) => {
              const startAngle = index * sliceAngle;
              const endAngle = (index + 1) * sliceAngle;

              // Convert polar to cartesian
              const startRad = ((startAngle - 90) * Math.PI) / 180;
              const endRad = ((endAngle - 90) * Math.PI) / 180;

              const x1 = 50 + 50 * Math.cos(startRad);
              const y1 = 50 + 50 * Math.sin(startRad);
              const x2 = 50 + 50 * Math.cos(endRad);
              const y2 = 50 + 50 * Math.sin(endRad);

              const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

              // Text position
              const textAngle = startAngle + sliceAngle / 2;
              const textRad = ((textAngle - 90) * Math.PI) / 180;
              const tx = 50 + 33 * Math.cos(textRad);
              const ty = 50 + 33 * Math.sin(textRad);

              return (
                <g key={slice.id}>
                  <path d={pathData} fill={slice.color} stroke="#FFFFFF" strokeWidth="0.8" />
                  <text
                    x={tx}
                    y={ty}
                    fill="#FFFFFF"
                    fontSize="3.8"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textAngle + 90}, ${tx}, ${ty})`}
                  >
                    {slice.text.slice(0, 14)}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Golden Center Hub */}
          <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-yellow-500 border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold text-amber-900 pointer-events-none">
            👑
          </div>
        </div>
      </div>

      {/* Spin Button */}
      <div className="mt-4">
        <button
          onClick={handleSpin}
          disabled={isSpinning}
          className={`px-8 py-3 rounded-full font-bold text-sm text-white flex items-center gap-2 shadow-glow-pink transition-all ${
            isSpinning
              ? "bg-slate-400 cursor-not-allowed opacity-75"
              : "bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:scale-105 active:scale-95 cursor-pointer"
          }`}
        >
          <RotateCw className={`w-4 h-4 ${isSpinning ? "animate-spin" : ""}`} />
          <span>{isSpinning ? "Spinning the Wheel..." : "SPIN THE WHEEL ✨"}</span>
        </button>
      </div>

      {/* Selected Reward Card Modal/Banner */}
      {selectedReward && (
        <div className="w-full mt-4 p-4 rounded-2xl bg-gradient-to-r from-pink-100 via-amber-50 to-purple-100 dark:from-pink-950/60 dark:via-purple-950/60 dark:to-slate-800 border-2 border-pink-300 dark:border-pink-800 text-center animate-fadeIn shadow-md">
          <div className="text-2xl mb-1">🎁 🎉 👑</div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-pink-600 dark:text-pink-300">
            {selectedReward.text}
          </span>
          <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 mt-1 leading-snug">
            "{selectedReward.reward}"
          </p>
        </div>
      )}
    </div>
  );
}

