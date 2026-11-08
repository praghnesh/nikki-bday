import React, { useState } from "react";
import { Camera, ChevronLeft, ChevronRight, X, Heart, Calendar, MapPin, Sparkles, BookOpen, ArrowRight, ArrowLeft } from "lucide-react";
import { memoriesData, timelineMilestones } from "../data/memories";
import { sound } from "../utils/audioSynth";
import { triggerHeartConfetti } from "../utils/confetti";

export default function MemoryGallery({ onNavigate }) {
  const [activeTab, setActiveTab] = useState("scrapbook"); // 'scrapbook', 'carousel', 'timeline'
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [likedPhotos, setLikedPhotos] = useState(new Set());

  const handleToggleLike = (id, e) => {
    e.stopPropagation();
    sound.playPop();
    triggerHeartConfetti();
    setLikedPhotos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleNextSlide = () => {
    sound.playClick();
    setCarouselIndex((prev) => (prev + 1) % memoriesData.length);
  };

  const handlePrevSlide = () => {
    sound.playClick();
    setCarouselIndex((prev) => (prev - 1 + memoriesData.length) % memoriesData.length);
  };

  const openLightbox = (item) => {
    sound.playClick();
    setSelectedPhoto(item);
  };

  const closeLightbox = () => {
    sound.playClick();
    setSelectedPhoto(null);
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] px-4 py-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800 text-pink-600 dark:text-pink-300 text-xs font-semibold mb-3">
          <Camera className="w-3.5 h-3.5 text-pink-500 animate-bounce-subtle" />
          <span>Nikki's Digital Scrapbook</span>
        </div>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-800 dark:text-white">
          A Gallery of Golden Memories 📸✨
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2">
          Every moment with you is etched in starlight. Tap on any photo to look closer!
        </p>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center justify-center gap-3 mb-10">
        {[
          { id: "scrapbook", label: "Polaroid Scrapbook", icon: "📸" },
          { id: "carousel", label: "Photo Carousel", icon: "🎞️" },
          { id: "timeline", label: "Nikki's Story Timeline", icon: "📖" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playClick();
              setActiveTab(tab.id);
            }}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-glow-pink"
                : "bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-pink-100 dark:border-slate-700 hover:bg-pink-50"
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Polaroid Scrapbook Grid */}
      {activeTab === "scrapbook" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {memoriesData.map((item) => {
            const isLiked = likedPhotos.has(item.id);
            return (
              <div
                key={item.id}
                onClick={() => openLightbox(item)}
                style={{ transform: `rotate(${item.polaroidAngle})` }}
                className="group relative bg-white dark:bg-slate-800 p-4 pb-6 rounded-2xl shadow-xl hover:shadow-2xl border border-pink-100 dark:border-slate-700 transition-all duration-300 hover:scale-105 hover:z-20 cursor-pointer"
              >
                {/* Washi Tape Accent at top */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-pink-200/80 dark:bg-pink-900/60 backdrop-blur-sm -rotate-2 rounded-sm shadow-sm opacity-80" />

                {/* Photo Frame */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-pink-50">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Floating heart like button */}
                  <button
                    onClick={(e) => handleToggleLike(item.id, e)}
                    className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-pink-500 hover:scale-110 transition shadow-sm"
                  >
                    <Heart
                      className={`w-4 h-4 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`}
                    />
                  </button>
                </div>

                {/* Polaroid Bottom Note */}
                <div className="px-1">
                  <h3 className="font-display font-bold text-base text-slate-800 dark:text-white">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-pink-500" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-500" />
                      {item.location}
                    </span>
                  </div>
                  <p className="font-handwriting text-base text-slate-600 dark:text-pink-100 mt-2 line-clamp-2">
                    "{item.caption}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Interactive Photo Carousel */}
      {activeTab === "carousel" && (
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-3xl shadow-2xl border border-pink-200 dark:border-pink-900/60 overflow-hidden">
            {/* Carousel Slide */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4">
              <img
                src={memoriesData[carouselIndex].image}
                alt={memoriesData[carouselIndex].title}
                className="w-full h-full object-cover transition-all duration-500"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <span className="px-2.5 py-0.5 rounded-full bg-pink-500 text-white text-[10px] font-bold uppercase tracking-wider mb-2 inline-block">
                    {memoriesData[carouselIndex].date}
                  </span>
                  <h3 className="font-display font-bold text-xl sm:text-2xl drop-shadow">
                    {memoriesData[carouselIndex].title}
                  </h3>
                  <p className="font-handwriting text-lg sm:text-xl text-pink-100 mt-1 drop-shadow">
                    "{memoriesData[carouselIndex].caption}"
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between px-2">
              <button
                onClick={handlePrevSlide}
                className="p-2.5 rounded-full bg-pink-50 dark:bg-slate-800 text-pink-600 dark:text-pink-300 hover:bg-pink-100 transition shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-1.5">
                {memoriesData.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sound.playClick();
                      setCarouselIndex(idx);
                    }}
                    className={`h-2 rounded-full transition-all ${
                      carouselIndex === idx
                        ? "w-6 bg-pink-500 shadow-glow-pink"
                        : "w-2 bg-pink-200 dark:bg-slate-700"
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={handleNextSlide}
                className="p-2.5 rounded-full bg-pink-50 dark:bg-slate-800 text-pink-600 dark:text-pink-300 hover:bg-pink-100 transition shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Nikki's Story Timeline */}
      {activeTab === "timeline" && (
        <div className="max-w-2xl mx-auto py-4">
          <div className="relative border-l-2 border-pink-300 dark:border-pink-800 ml-4 sm:ml-8 space-y-8">
            {timelineMilestones.map((milestone, idx) => (
              <div key={idx} className="relative pl-6 sm:pl-8 group">
                {/* Timeline node icon */}
                <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center text-sm shadow-md ring-4 ring-white dark:ring-slate-900 group-hover:scale-110 transition-transform">
                  {milestone.icon}
                </div>

                {/* Milestone Card */}
                <div className="p-5 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-pink-100 dark:border-slate-700 shadow-sm hover:shadow-md transition">
                  <span className="text-xs font-bold uppercase tracking-wider text-pink-500 dark:text-pink-400">
                    {milestone.year}
                  </span>
                  <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white mt-0.5">
                    {milestone.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    {milestone.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Surprise Navigation Bar */}
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-pink-200 dark:border-pink-900/50 shadow-lg">
        <button
          onClick={() => onNavigate && onNavigate("arcade")}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-pink-200 dark:border-slate-700 hover:bg-pink-50 transition shadow-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back: Game Arcade 🎮</span>
        </button>

        <button
          onClick={() => onNavigate && onNavigate("special")}
          className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 shadow-glow-pink hover:shadow-glow-purple hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span>NEXT: HOW SPECIAL ARE YOU? 💖</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
        </button>
      </div>

      {/* Lightbox Enlargement Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-pink-200 dark:border-pink-900 relative">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/40 text-white hover:bg-black/70 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/10] w-full overflow-hidden">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold text-xl text-slate-800 dark:text-white">
                  {selectedPhoto.title}
                </h3>
                <span className="text-xs text-pink-500 font-semibold">{selectedPhoto.date}</span>
              </div>
              <p className="font-handwriting text-xl text-slate-700 dark:text-pink-100 mb-4">
                "{selectedPhoto.caption}"
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedPhoto.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

