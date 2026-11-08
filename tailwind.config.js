/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nikki: {
          pink: '#FFB6C1',
          lightPink: '#FFF0F5',
          hotPink: '#FF69B4',
          deepPink: '#FF1493',
          lavender: '#E6E6FA',
          deepLavender: '#9370DB',
          purple: '#BA55D3',
          darkPurple: '#4A154B',
          peach: '#FFDAB9',
          roseGold: '#B76E79',
          gold: '#FFD700',
          cream: '#FFFDD0',
          glass: 'rgba(255, 255, 255, 0.45)',
          glassDark: 'rgba(25, 10, 30, 0.65)'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        handwriting: ['"Dancing Script"', '"Caveat"', 'cursive'],
        display: ['"Playfair Display"', 'serif'],
        magical: ['"Great Vibes"', 'cursive']
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-medium': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'spin-slow': 'spin 18s linear infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite linear',
        'bounce-subtle': 'bounceSubtle 2s infinite ease-in-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.8', filter: 'drop-shadow(0 0 15px rgba(255, 105, 180, 0.6))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 25px rgba(255, 182, 193, 0.9))' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      boxShadow: {
        'glow-pink': '0 0 25px rgba(255, 105, 180, 0.45)',
        'glow-purple': '0 0 25px rgba(186, 85, 211, 0.45)',
        'glow-gold': '0 0 25px rgba(255, 215, 0, 0.45)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'glass-inset': 'inset 0 0 15px rgba(255, 255, 255, 0.4)',
      }
    },
  },
  plugins: [],
}

