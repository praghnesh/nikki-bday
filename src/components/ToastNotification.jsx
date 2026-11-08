import React from "react";
import { Award, Sparkles, X } from "lucide-react";

export default function ToastNotification({ toast, onDismiss }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-subtle">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-pink-300 dark:border-pink-800 rounded-2xl p-4 shadow-2xl flex items-center gap-3.5 max-w-sm">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-white flex items-center justify-center text-lg shadow-md flex-shrink-0">
          {toast.icon || "🏆"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase font-bold text-pink-600 dark:text-pink-300 tracking-wider">
            Achievement Unlocked!
          </div>
          <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white truncate">
            {toast.title}
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

