import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0ea5e9', // cyan
          light: '#7dd3fc',
          dark: '#0369a1',
        },
        secondary: {
          DEFAULT: '#8b5cf6', // violet
          light: '#c4b5fd',
          dark: '#6d28d9',
        },
        dark: {
          DEFAULT: '#1e293b', // dark slate
          light: '#334155',
          dark: '#0f172a',
        }
      },
    },
  },
  plugins: [],
};

export default config;
