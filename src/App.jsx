import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import FloatingParticles from "./components/FloatingParticles";
import AchievementsModal from "./components/AchievementsModal";
import ToastNotification from "./components/ToastNotification";
import ErrorBoundary from "./components/ErrorBoundary";

// Main Sections
import IntroScreen from "./components/IntroScreen";
import GiftBox from "./components/GiftBox";
import GameArcade from "./components/GameArcade";
import MemoryGallery from "./components/MemoryGallery";
import SpecialPersonality from "./components/SpecialPersonality";
import SecretLetter from "./components/SecretLetter";
import BirthdayCake from "./components/BirthdayCake";
import TreasureHunt from "./components/TreasureHunt";
import FinalSurprise from "./components/FinalSurprise";

import { defaultAchievements } from "./data/achievements";
import { sound } from "./utils/audioSynth";

export default function App() {
  const [activeSection, setActiveSection] = useState("intro");
  const [isPlayingBgm, setIsPlayingBgm] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [achievementsModalOpen, setAchievementsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Load achievements from localStorage
  const [achievements, setAchievements] = useState(() => {
    try {
      const saved = localStorage.getItem("nikki_achievements");
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore fallback
    }
    return defaultAchievements;
  });

  // Dark mode effect on root element
  useEffect(() => {
    if (isDarkTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkTheme]);

  // Unlock achievement helper
  const unlockAchievement = (id) => {
    setAchievements((prev) => {
      const item = prev.find((a) => a.id === id);
      if (!item || item.unlocked) return prev;

      const next = prev.map((a) => (a.id === id ? { ...a, unlocked: true } : a));
      localStorage.setItem("nikki_achievements", JSON.stringify(next));

      // Trigger achievement notification toast
      setToast({
        title: item.title,
        desc: item.desc,
        icon: item.icon,
      });

      setTimeout(() => {
        setToast((current) => (current?.title === item.title ? null : current));
      }, 4500);

      return next;
    });
  };

  const navigateToSection = (sectionId) => {
    sound.playClick();
    setActiveSection(sectionId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEnterUniverse = () => {
    setIsPlayingBgm(true);
    navigateToSection("gift");
  };

  const handleReplay = () => {
    navigateToSection("intro");
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${
      isDarkTheme
        ? "dark bg-[#0F0715] text-slate-100 selection:bg-purple-900 selection:text-pink-200"
        : "bg-gradient-to-br from-[#FFF5F8] via-[#FDF0F5] to-[#F5EEF8] text-slate-800"
    }`}>
      {/* Background Floating Magical Particles */}
      <FloatingParticles />

      {/* Fixed Navigation & Music Player Bar */}
      <Navbar
        activeSection={activeSection}
        setActiveSection={navigateToSection}
        isPlayingBgm={isPlayingBgm}
        setIsPlayingBgm={setIsPlayingBgm}
        achievements={achievements}
        onOpenAchievements={() => setAchievementsModalOpen(true)}
        isDarkTheme={isDarkTheme}
        setIsDarkTheme={setIsDarkTheme}
      />

      {/* Main Content Area */}
      <ErrorBoundary>
        <main className="pt-16 pb-12 relative z-10">
          {activeSection === "intro" && (
            <IntroScreen
              onEnterUniverse={handleEnterUniverse}
              unlockAchievement={unlockAchievement}
            />
          )}
          {activeSection === "gift" && (
            <GiftBox
              onNavigate={navigateToSection}
              unlockAchievement={unlockAchievement}
            />
          )}
          {activeSection === "arcade" && (
            <GameArcade
              onNavigate={navigateToSection}
              unlockAchievement={unlockAchievement}
            />
          )}
          {activeSection === "memories" && (
            <MemoryGallery onNavigate={navigateToSection} />
          )}
          {activeSection === "special" && (
            <SpecialPersonality
              onNavigate={navigateToSection}
              unlockAchievement={unlockAchievement}
            />
          )}
          {activeSection === "letter" && (
            <SecretLetter
              onNavigate={navigateToSection}
              unlockAchievement={unlockAchievement}
            />
          )}
          {activeSection === "cake" && (
            <BirthdayCake
              onNavigate={navigateToSection}
              unlockAchievement={unlockAchievement}
            />
          )}
          {activeSection === "treasure" && (
            <TreasureHunt
              onNavigate={navigateToSection}
              unlockAchievement={unlockAchievement}
            />
          )}
          {activeSection === "finale" && (
            <FinalSurprise
              onReplay={handleReplay}
              unlockAchievement={unlockAchievement}
            />
          )}
        </main>
      </ErrorBoundary>

      {/* Achievements Modal */}
      <AchievementsModal
        isOpen={achievementsModalOpen}
        onClose={() => setAchievementsModalOpen(false)}
        achievements={achievements}
      />

      {/* Floating Notification Toast */}
      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}

