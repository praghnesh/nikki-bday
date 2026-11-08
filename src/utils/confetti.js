import confetti from "canvas-confetti";

export const triggerConfetti = (options = {}) => {
  const defaults = {
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#FF69B4", "#BA55D3", "#FFD700", "#FFB6C1", "#E6E6FA", "#FFA07A"],
    disableForReducedMotion: true,
  };
  confetti({ ...defaults, ...options });
};

export const triggerHeartConfetti = () => {
  const count = 50;
  const defaults = {
    origin: { y: 0.7 },
    spread: 90,
    ticks: 200,
    gravity: 0.8,
    decay: 0.94,
    startVelocity: 30,
    colors: ["#FF1493", "#FF69B4", "#FFB6C1", "#BA55D3", "#FFD700"],
    shapes: ["circle"],
  };

  confetti({
    ...defaults,
    particleCount: count,
  });
};

export const triggerGrandFireworks = (durationMs = 4000) => {
  const animationEnd = Date.now() + durationMs;
  const colors = ["#FF69B4", "#BA55D3", "#FFD700", "#00FFFF", "#FFA07A", "#FF1493"];

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / durationMs);

    confetti({
      particleCount,
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      origin: { x: Math.random(), y: Math.random() - 0.2 },
      colors: colors,
    });
  }, 300);
};

