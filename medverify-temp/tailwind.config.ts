import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0052FF',
          light: '#3374FF',
          dark: '#003ACC',
        },
        success: '#00C48C',
        danger: '#FF2D55',
        warning: '#FF9500',
        glass: {
          100: 'rgba(255, 255, 255, 0.1)',
          200: 'rgba(255, 255, 255, 0.2)',
          400: 'rgba(255, 255, 255, 0.4)',
          600: 'rgba(255, 255, 255, 0.6)',
          800: 'rgba(255, 255, 255, 0.8)',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        app: '420px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
        'scan-line': 'scanLine 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'radar': 'radar 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-hover': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'neumorphic': '8px 8px 16px #d1d5db, -8px -8px 16px #ffffff',
        'neumorphic-inset': 'inset 8px 8px 16px #d1d5db, inset -8px -8px 16px #ffffff',
        'blue-glow': '0 0 20px rgba(0, 82, 255, 0.4)',
        'emerald-glow': '0 0 20px rgba(0, 196, 140, 0.4)',
        'crimson-glow': '0 0 20px rgba(255, 45, 85, 0.4)',
      },
    },
  },
  plugins: [],
};

export default config;
