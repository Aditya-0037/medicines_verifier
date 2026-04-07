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
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        shell: '480px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite',
        'scan-line': 'scanLine 2s ease-in-out infinite',
      },
      boxShadow: {
        'blue-sm': '0 2px 10px rgba(0, 82, 255, 0.15)',
        'blue-md': '0 4px 20px rgba(0, 82, 255, 0.2)',
        'blue-lg': '0 8px 40px rgba(0, 82, 255, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
