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
          darker: '#0b1221',
        },
        // Add document and proof specific colors
        document: {
          DEFAULT: '#0ea5e9',
          light: '#7dd3fc',
        },
        proof: {
          DEFAULT: '#8b5cf6',
          light: '#c4b5fd',
        }
      },
      borderRadius: {
        'card': '0.5rem',
      },
      spacing: {
        'form-group': '1.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
