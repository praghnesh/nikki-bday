import React, { useState, useEffect } from "react";
import { RotateCcw, Trophy, Sparkles, Award, ArrowRight, Eye } from "lucide-react";
import { nikkiPhotos } from "../data/memories";
import { sound } from "../utils/audioSynth";
import { triggerConfetti } from "../utils/confetti";

export default function MemoryMatch({ onScoreUpdate, unlockAchievement, onLevelComplete }) {
  const [level, setLevel] = useState(1); // Level 1: 4 pairs (8 cards), Level 2: 8 pairs (16 cards)
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isPeeking, setIsPeeking] = useState(false);

  const activePhotoSet = level === 1 ? nikkiPhotos.slice(0, 4) : nikkiPhotos.slice(0, 8);

  // Initialize and shuffle cards using Nikki's photos
  const initGame = (selectedLevel = level, autoPeek = true) => {
    sound.playSparkle();
    const photosToUse = selectedLevel === 1 ? nikkiPhotos.slice(0, 4) : nikkiPhotos.slice(0, 8);

    const deck = [...photosToUse, ...photosToUse]
      .map((item, index) => ({
        uniqueKey: `${item.id}-${index}-${Math.random()}`,
        id: item.id,
        url: item.url,
        name: item.name,
        label: item.label,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(deck);
    setFlippedIndices([]);
    setMatchedIds([]);
    setMoves(0);
    setIsWon(false);

    // Brief 1.5s peek at start so Nikki immediately sees the photos!
    if (autoPeek) {
      setIsPeeking(true);
      setTimeout(() => {
        setIsPeeking(false);
      }, 1500);
    }
  };

  useEffect(() => {
    initGame(level, true);
  }, [level]);

  const handleCardClick = (index) => {
    if (
      isPeeking ||
      flippedIndices.length === 2 ||
      flippedIndices.includes(index) ||
      matchedIds.includes(cards[index]?.id)
    ) {
      return;
    }

    sound.playClick();
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    // If 2 cards flipped, check for match
    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = cards[firstIdx];
      const secondCard = cards[secondIdx];

      if (firstCard && secondCard && firstCard.id === secondCard.id) {
        // Matched Nikki's photos!
        setTimeout(() => {
          sound.playChime();
          setMatchedIds((prev) => {
            const next = [...prev, firstCard.id];
            if (next.length === activePhotoSet.length) {
              // Level Won!
              setTimeout(() => {
                sound.playSuccessFanfare();
                triggerConfetti({ particleCount: 100, spread: 80 });
                setIsWon(true);
                if (unlockAchievement) unlockAchievement("memory_master");
                if (onScoreUpdate) onScoreUpdate(level === 1 ? 50 : 100);
              }, 400);
            }
            return next;
          });
          setFlippedIndices([]);
        }, 500);
      } else {
        // Not matched - flip back
        setTimeout(() => {
          setFlippedIndices([]);
        }, 850);
      }
    }
  };

  const handleManualPeek = () => {
    if (isPeeking) return;
    sound.playSparkle();
    setIsPeeking(true);
    setTimeout(() => {
      setIsPeeking(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4 sm:p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-pink-200 dark:border-pink-900/60 shadow-xl">
      {/* Top Controls Bar */}
      <div className="w-full flex items-center justify-between mb-4 px-2 flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setLevel(1)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
              level === 1
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm"
                : "bg-pink-100 text-pink-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-pink-200"
            }`}
          >
            Level 1 (8 Photos)
          </button>
          <button
            onClick={() => setLevel(2)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
              level === 2
                ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-sm"
                : "bg-pink-100 text-pink-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-pink-200"
            }`}
          >
            Level 2 (16 Photos)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleManualPeek}
            disabled={isPeeking}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition cursor-pointer"
            title="Peek photos for 2 seconds"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{isPeeking ? "Peeking..." : "Peek (2s)"}</span>
          </button>

          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
            Moves: {moves}
          </span>

          <button
            onClick={() => initGame(level, false)}
            className="p-1.5 rounded-full hover:bg-pink-100 dark:hover:bg-slate-800 text-pink-600 dark:text-pink-300 transition cursor-pointer"
            title="Restart Board"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="text-center text-xs font-semibold text-pink-600 dark:text-pink-300 mb-3">
        Matches Found: {matchedIds.length} of {activePhotoSet.length} Pairs 📸
      </div>

      {/* Grid of Photo Cards */}
      <div
        className={`grid gap-2.5 sm:gap-3.5 w-full mb-4 select-none ${
          level === 1 ? "grid-cols-4 max-w-sm" : "grid-cols-4 max-w-md"
        }`}
      >
        {cards.map((card, index) => {
          const isFlipped =
            isPeeking ||
            flippedIndices.includes(index) ||
            matchedIds.includes(card.id);
          const isMatched = matchedIds.includes(card.id);

          return (
            <div
              key={card.uniqueKey}
              onClick={() => handleCardClick(index)}
              className="relative aspect-square rounded-2xl cursor-pointer select-none touch-manipulation transform transition-all duration-300 active:scale-95"
            >
              {isFlipped ? (
                /* REVEALED CARD (NIKKI'S REAL PHOTO) */
                <div
                  className={`w-full h-full rounded-2xl overflow-hidden border-2 relative shadow-md transition-all duration-200 bg-white ${
                    isMatched
                      ? "border-amber-400 ring-2 ring-pink-400 shadow-glow-pink scale-95"
                      : "border-pink-400 shadow-lg scale-100"
                  }`}
                >
                  <img
                    src={card.url}
                    alt={card.name}
                    className="w-full h-full object-cover block"
                    loading="eager"
                  />
                  {/* Bottom caption with Nikki's cute label */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-1 py-0.5 text-center pointer-events-none">
                    <span className="text-[9px] font-bold text-white truncate block drop-shadow">
                      {card.label}
                    </span>
                  </div>

                  {isMatched && (
                    <div className="absolute inset-0 bg-pink-500/20 backdrop-blur-[1px] flex items-center justify-center">
                      <span className="text-2xl filter drop-shadow animate-bounce">💖</span>
                    </div>
                  )}
                </div>
              ) : (
                /* CARD BACK (HIDDEN STATE) */
                <div className="w-full h-full rounded-2xl bg-gradient-to-br from-pink-400 via-rose-400 to-purple-500 border-2 border-white/80 shadow-md flex flex-col items-center justify-center hover:scale-105 transition-transform duration-200 hover:shadow-glow-pink">
                  <span className="text-white text-2xl sm:text-3xl font-extrabold font-serif drop-shadow">
                    N
                  </span>
                  <span className="text-white/90 text-xs mt-0.5">❤️</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Winning Celebration */}
      {isWon && (
        <div className="text-center p-4 bg-gradient-to-r from-pink-100 via-purple-100 to-amber-100 dark:from-pink-950/60 dark:via-purple-950/60 dark:to-slate-800 rounded-2xl border border-pink-200 dark:border-pink-800 w-full animate-fadeIn mb-2">
          <div className="text-3xl mb-1">🎉 📸 👑</div>
          <h4 className="font-display font-bold text-lg text-slate-800 dark:text-white">
            Matched All Nikki's Photos!
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            You solved all matching photos in just {moves} moves!
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            {level === 1 ? (
              <button
                onClick={() => setLevel(2)}
                className="inline-flex items-center gap-1.5 px-6 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 transition shadow-sm cursor-pointer"
              >
                <span>Play Level 2 (16 Photos)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => initGame(level, false)}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-pink-200 dark:border-slate-700 hover:bg-pink-50 transition shadow-sm cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Play Again</span>
              </button>
            )}

            {onLevelComplete && (
              <button
                onClick={onLevelComplete}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-glow-pink hover:scale-105 transition cursor-pointer"
              >
                <span>Proceed to Level 10 (Hearts vs Stars) 🚀</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {!isWon && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
          Tap two cards to find matching photos of Nikki! Click "Peek" for a 2s memory hint!
        </p>
      )}
    </div>
  );
}
