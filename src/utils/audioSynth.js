// Procedural Web Audio API sound synthesizer and background music engine
// Guaranteed 100% reliable without external audio downloads, CORS, or broken URLs!

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.volume = 0.6;
    this.isPlayingBgm = false;
    this.bgmTimer = null;
    this.bgmNoteIndex = 0;
    this.currentTrack = "musicBox"; // "musicBox" | "pianoLullaby"
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (muted && this.isPlayingBgm) {
      this.stopBgm();
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  // Soft note synthesis with envelope (Music Box / Bell timbre)
  playTone(freq, type = "sine", duration = 0.4, gainLevel = 0.3, detune = 0) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.detune.setValueAtTime(detune, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      const effectiveGain = gainLevel * this.volume;

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(effectiveGain, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio fallback catch
    }
  }

  // Harmonic Bell Tone (chime/celesta)
  playBell(freq, duration = 0.8, gain = 0.25) {
    if (this.isMuted) return;
    this.playTone(freq, "sine", duration, gain);
    this.playTone(freq * 2.01, "sine", duration * 0.7, gain * 0.4);
    this.playTone(freq * 3.02, "triangle", duration * 0.5, gain * 0.2);
  }

  // Sound Effects
  playClick() {
    this.playTone(800, "sine", 0.05, 0.15);
  }

  playPop() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = "sine";
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      gain.gain.setValueAtTime(0.4 * this.volume, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Audio catch
    }
  }

  playChime() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playBell(freq, 0.6, 0.2), idx * 80);
    });
  }

  playSparkle() {
    const notes = [587.33, 739.99, 880.0, 1174.66, 1479.98];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, "triangle", 0.4, 0.15), idx * 70);
    });
  }

  playWhack() {
    this.playTone(320, "triangle", 0.1, 0.3);
    setTimeout(() => this.playTone(480, "sine", 0.1, 0.2), 30);
  }

  playWheelTick() {
    this.playTone(600, "triangle", 0.04, 0.15);
  }

  playCandleBlow() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      // Noise burst for blow effect
      const bufferSize = this.ctx.sampleRate * 0.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 600;
      filter.Q.value = 1.2;

      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.3 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.5);
    } catch {
      // Catch audio
    }
  }

  playScratch() {
    this.playTone(400 + Math.random() * 300, "triangle", 0.05, 0.08);
  }

  playSimonNote(index) {
    const freqs = [329.63, 392.00, 493.88, 587.33]; // E4, G4, B4, D5
    this.playBell(freqs[index % freqs.length], 0.5, 0.3);
  }

  playSuccessFanfare() {
    const melody = [
      { f: 523.25, d: 150 }, // C5
      { f: 659.25, d: 150 }, // E5
      { f: 783.99, d: 150 }, // G5
      { f: 1046.50, d: 350 }, // C6
      { f: 880.00, d: 150 }, // A5
      { f: 1046.50, d: 500 } // C6
    ];
    let offset = 0;
    melody.forEach(item => {
      setTimeout(() => {
        this.playBell(item.f, item.d / 1000 + 0.3, 0.28);
      }, offset);
      offset += item.d;
    });
  }

  // Continuous Gentle Romantic Music Box Melody ("Happy Birthday" + Sweet Lullaby in loop)
  startBgm() {
    if (this.isPlayingBgm || this.isMuted) return;
    this.init();
    this.isPlayingBgm = true;

    // Melody: Happy Birthday & Sweet Dream theme in G Major / C Major (Gentle Music Box)
    // Format: [freq, durationInMs]
    const melody = [
      // Happy Birthday Phrase 1
      [392.0, 350], [392.0, 250], [440.0, 600], [392.0, 600], [523.25, 600], [493.88, 1100],
      // Phrase 2
      [392.0, 350], [392.0, 250], [440.0, 600], [392.0, 600], [587.33, 600], [523.25, 1100],
      // Phrase 3
      [392.0, 350], [392.0, 250], [783.99, 600], [659.25, 600], [523.25, 600], [493.88, 600], [440.0, 900],
      // Phrase 4 (Dear Nikki)
      [698.46, 350], [698.46, 250], [659.25, 600], [523.25, 600], [587.33, 600], [523.25, 1300],
      // Gentle Dream Arpeggio Transition
      [392.0, 450], [523.25, 450], [659.25, 450], [783.99, 700],
      [659.25, 450], [587.33, 450], [523.25, 800],
      [440.0, 450], [523.25, 450], [659.25, 700],
      [493.88, 450], [587.33, 450], [523.25, 1200]
    ];

    const step = () => {
      if (!this.isPlayingBgm || this.isMuted) return;
      const [freq, dur] = melody[this.bgmNoteIndex];
      this.playBell(freq, dur / 1000 + 0.35, 0.18);

      // Play soft bass harmony note every 4 notes
      if (this.bgmNoteIndex % 4 === 0) {
        this.playTone(freq / 2, "sine", 1.2, 0.08);
      }

      this.bgmNoteIndex = (this.bgmNoteIndex + 1) % melody.length;
      this.bgmTimer = setTimeout(step, dur);
    };

    step();
  }

  stopBgm() {
    this.isPlayingBgm = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  toggleBgm() {
    if (this.isPlayingBgm) {
      this.stopBgm();
      return false;
    } else {
      this.startBgm();
      return true;
    }
  }
}

export const sound = new SoundEngine();

