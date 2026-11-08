import React from "react";
import { X, Award, CheckCircle2, Lock } from "lucide-react";
import { sound } from "../utils/audioSynth";

export default function AchievementsModal({ isOpen, onClose, achievements }) {
  if (!isOpen) return null;

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const progressPercent = Math.round((unlockedCount / achievements.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-pink-200 dark:border-pink-900/60 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Background decorative glows */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-pink-300/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-purple-300/30 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-pink-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-slate-800 dark:text-white">
                Birthday Achievements
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Unlock badges as you explore Nikki's Universe
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="my-4 bg-pink-50 dark:bg-slate-800/80 p-3.5 rounded-2xl border border-pink-100 dark:border-slate-700">
          <div className="flex justify-between items-center text-xs font-semibold mb-2">
            <span className="text-pink-600 dark:text-pink-300">
              Adventure Progress: {unlockedCount} of {achievements.length} Badges
            </span>
            <span className="text-purple-600 dark:text-purple-300">{progressPercent}%</span>
          </div>
          <div className="w-full bg-pink-200/60 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full transition-all duration-500 shadow-glow-pink"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Achievements List */}
        <div className="overflow-y-auto space-y-2.5 pr-1 flex-1 py-1">
          {achievements.map((item) => (
            <div
              key={item.id}
              className={`flex items-center gap-3.5 p-3 rounded-2xl border transition-all ${
                item.unlocked
                  ? "bg-gradient-to-r from-pink-50/80 to-purple-50/80 dark:from-pink-950/30 dark:to-purple-950/30 border-pink-200 dark:border-pink-800/50 shadow-sm"
                  : "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 opacity-60"
              }`}
            >
              <div
                className={`text-2xl p-2 rounded-xl flex items-center justify-center ${
                  item.unlocked
                    ? "bg-white dark:bg-slate-800 shadow-sm"
                    : "bg-slate-200 dark:bg-slate-700 grayscale"
                }`}
              >
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">
                    {item.title}
                  </h4>
                  {item.unlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-pink-100 dark:border-slate-800 text-center">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium text-sm hover:opacity-90 shadow-glow-pink transition"
          >
            Keep Exploring ✨
          </button>
        </div>
      </div>
    </div>
  );
}

