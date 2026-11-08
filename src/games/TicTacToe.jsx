import React, { useState, useEffect } from "react";
import { RotateCcw, Trophy, Award, Sparkles, Heart, ArrowRight } from "lucide-react";
import { sound } from "../utils/audioSynth";
import { triggerConfetti } from "../utils/confetti";

const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

export default function TicTacToe({ onScoreUpdate, unlockAchievement, onLevelComplete }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null); // 'player', 'ai', 'draw', null
  const [winningLine, setWinningLine] = useState([]);
  const [scores, setScores] = useState({ player: 0, ai: 0, ties: 0 });

  const checkWinner = (squares) => {
    for (const combo of WINNING_COMBOS) {
      const [a, b, c] = combo;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: combo };
      }
    }
    if (squares.every((sq) => sq !== null)) {
      return { winner: "draw", line: [] };
    }
    return null;
  };

  const handleCellClick = (index) => {
    if (board[index] || !isPlayerTurn || winner) return;

    sound.playClick();
    const newBoard = [...board];
    newBoard[index] = "player"; // 'player' = 💖
    setBoard(newBoard);

    const result = checkWinner(newBoard);
    if (result) {
      finishGame(result);
    } else {
      setIsPlayerTurn(false);
    }
  };

  // AI Turn
  useEffect(() => {
    if (isPlayerTurn || winner) return;

    const timer = setTimeout(() => {
      // AI Move Logic (Smart AI: win if possible, block player if needed, or pick center/random)
      const availableMoves = board
        .map((val, idx) => (val === null ? idx : null))
        .filter((val) => val !== null);

      if (availableMoves.length === 0) return;

      let chosenMove = null;

      // 1. Can AI win?
      for (const idx of availableMoves) {
        const testBoard = [...board];
        testBoard[idx] = "ai";
        if (checkWinner(testBoard)?.winner === "ai") {
          chosenMove = idx;
          break;
        }
      }

      // 2. Can player win? Block them!
      if (chosenMove === null) {
        for (const idx of availableMoves) {
          const testBoard = [...board];
          testBoard[idx] = "player";
          if (checkWinner(testBoard)?.winner === "player") {
            chosenMove = idx;
            break;
          }
        }
      }

      // 3. Take center if open
      if (chosenMove === null && availableMoves.includes(4)) {
        chosenMove = 4;
      }

      // 4. Otherwise pick random available
      if (chosenMove === null) {
        chosenMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
      }

      sound.playClick();
      const newBoard = [...board];
      newBoard[chosenMove] = "ai";
      setBoard(newBoard);

      const result = checkWinner(newBoard);
      if (result) {
        finishGame(result);
      } else {
        setIsPlayerTurn(true);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [isPlayerTurn, winner, board]);

  const finishGame = ({ winner, line }) => {
    setWinner(winner);
    setWinningLine(line);

    if (winner === "player") {
      sound.playSuccessFanfare();
      triggerConfetti({ particleCount: 80 });
      setScores((s) => ({ ...s, player: s.player + 1 }));
      if (unlockAchievement) unlockAchievement("enter_universe");
      if (onScoreUpdate) onScoreUpdate(40);
    } else if (winner === "ai") {
      sound.playWhack();
      setScores((s) => ({ ...s, ai: s.ai + 1 }));
    } else {
      sound.playChime();
      setScores((s) => ({ ...s, ties: s.ties + 1 }));
    }
  };

  const resetRound = () => {
    sound.playClick();
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinningLine([]);
    setIsPlayerTurn(true);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-lg mx-auto p-4 sm:p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl border border-pink-200 dark:border-pink-900/60 shadow-xl">
      {/* Top Bar Scoreboard */}
      <div className="w-full flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-pink-600 dark:text-pink-300">
          <span>Nikki (💖): {scores.player}</span>
        </div>
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Ties: {scores.ties}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-300">
          <span>Stardust AI (⭐): {scores.ai}</span>
        </div>
      </div>

      {/* Turn indicator */}
      <div className="text-center mb-4">
        {winner ? (
          <div className="text-sm font-bold animate-pulse text-pink-600 dark:text-pink-300">
            {winner === "player"
              ? "👑 Nikki Wins! Fantastic move!"
              : winner === "ai"
              ? "⭐ Stardust AI won this round!"
              : "🤝 It's a peaceful draw!"}
          </div>
        ) : (
          <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            {isPlayerTurn ? "Your turn, Nikki! (💖)" : "Stardust AI is thinking... (⭐)"}
          </div>
        )}
      </div>

      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 gap-2.5 w-64 h-64 sm:w-72 sm:h-72 mb-4">
        {board.map((cell, idx) => {
          const isWinningCell = winningLine.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => handleCellClick(idx)}
              disabled={!!cell || !isPlayerTurn || !!winner}
              className={`rounded-2xl border-2 flex items-center justify-center text-3xl sm:text-4xl transition-all shadow-sm ${
                isWinningCell
                  ? "bg-gradient-to-br from-pink-200 to-purple-200 border-pink-500 scale-105 shadow-glow-pink"
                  : cell
                  ? "bg-white dark:bg-slate-800 border-pink-200 dark:border-slate-700"
                  : "bg-pink-50/60 dark:bg-slate-800/40 border-pink-100 dark:border-slate-800 hover:bg-pink-100/80 dark:hover:bg-slate-700/80 active:scale-95"
              }`}
            >
              {cell === "player" && (
                <span className="animate-scaleIn filter drop-shadow">💖</span>
              )}
              {cell === "ai" && (
                <span className="animate-scaleIn filter drop-shadow">⭐</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="mt-3 flex items-center justify-center gap-3">
        <button
          onClick={resetRound}
          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-pink-200 dark:border-slate-700 hover:bg-pink-50 transition shadow-sm cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Play Round Again</span>
        </button>

        {onLevelComplete && (
          <button
            onClick={onLevelComplete}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-purple-600 shadow-glow-pink hover:scale-105 transition cursor-pointer"
          >
            <span>Proceed to Level 11 (Birthday Quiz) 🚀</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

