import React, { useState } from "react";
import { Music, Volume2, VolumeX, Sparkles, Award, Moon, Sun, Menu, X, Heart } from "lucide-react";
import { sound } from "../utils/audioSynth";

export default function Navbar({
  activeSection,
  setActiveSection,
  isPlayingBgm,
  setIsPlayingBgm,
  achievements,
  onOpenAchievements,
  isDarkTheme,
  setIsDarkTheme,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const handleToggleBgm = () => {
    sound.playClick();
    const playing = sound.toggleBgm();
    setIsPlayingBgm(playing);
  };

  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    sound.setVolume(v);
  };

  const navItems = [
    { id: "intro", label: "Intro", icon: "✨" },
    { id: "gift", label: "Gift Box", icon: "🎁" },
    { id: "arcade", label: "Game Arcade", icon: "🎮", badge: "12 Games" },
    { id: "memories", label: "Memories", icon: "📸" },
    { id: "special", label: "Special You", icon: "💖" },
    { id: "letter", label: "Secret Letter", icon: "💌" },
    { id: "cake", label: "Birthday Cake", icon: "🎂" },
    { id: "treasure", label: "Quest", icon: "🗺️" },
    { id: "finale", label: "Grand Finale", icon: "🎆" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-white/70 dark:bg-slate-900/80 border-b border-pink-200/50 dark:border-pink-900/40 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            onClick={() => {
              sound.playClick();
              setActiveSection("intro");
            }}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <span className="text-2xl animate-bounce-subtle">👑</span>
            <div>
              <span className="font-display font-bold text-lg sm:text-xl bg-gradient-to-r from-pink-500 via-purple-500 to-rose-400 bg-clip-text text-transparent group-hover:opacity-90 transition">
                Nikki's Universe
              </span>
              <span className="hidden sm:inline-block text-xs text-pink-400 dark:text-pink-300 font-medium ml-2">
                🎂 Happy Birthday!
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveSection(item.id);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs xl:text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-glow-pink scale-105"
                      : "text-slate-600 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-300 hover:bg-pink-50 dark:hover:bg-pink-950/30"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="bg-pink-200 dark:bg-pink-900 text-pink-700 dark:text-pink-200 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action Icons: Audio, Achievements, Theme, Mobile toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Music Player Button with Visualizer */}
            <div className="relative flex items-center">
              <button
                onClick={handleToggleBgm}
                title={isPlayingBgm ? "Pause Sweet Birthday Melody" : "Play Gentle Birthday Melody"}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  isPlayingBgm
                    ? "bg-pink-100 dark:bg-pink-950/60 border-pink-400 text-pink-600 dark:text-pink-300 shadow-glow-pink"
                    : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                }`}
              >
                <Music className={`w-3.5 h-3.5 ${isPlayingBgm ? "animate-spin-slow text-pink-500" : ""}`} />
                <span className="hidden sm:inline">
                  {isPlayingBgm ? "Playing Melody" : "Play Music"}
                </span>
                {isPlayingBgm && (
                  <span className="flex items-end gap-0.5 h-3 ml-1">
                    <span className="w-0.5 h-2 bg-pink-500 animate-pulse"></span>
                    <span className="w-0.5 h-3 bg-purple-500 animate-pulse" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-0.5 h-1.5 bg-rose-400 animate-pulse" style={{ animationDelay: "300ms" }}></span>
                  </span>
                )}
              </button>

              {/* Volume Slider Dropdown Trigger */}
              <button
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                className="p-1.5 ml-1 text-slate-500 dark:text-slate-400 hover:text-pink-500"
                title="Adjust Volume"
              >
                {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {showVolumeSlider && (
                <div className="absolute top-12 right-0 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl border border-pink-100 dark:border-slate-700 flex flex-col items-center gap-2 w-36 z-50">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-300">
                    Volume ({Math.round(volume * 100)}%)
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full accent-pink-500 cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Achievements Modal Trigger */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenAchievements();
              }}
              title="View Unlocked Achievements"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:scale-105 transition"
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>
                {unlockedCount}/{achievements.length}
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => {
                sound.playClick();
                setIsDarkTheme(!isDarkTheme);
              }}
              className="p-2 rounded-full text-slate-500 hover:text-pink-500 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-slate-800 transition"
              title="Toggle Romantic Night Theme"
            >
              {isDarkTheme ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-pink-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 pt-3 pb-6 space-y-1 shadow-lg">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                sound.playClick();
                setActiveSection(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                activeSection === item.id
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold"
                  : "text-slate-700 dark:text-slate-200 hover:bg-pink-50 dark:hover:bg-slate-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{item.badge}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}

