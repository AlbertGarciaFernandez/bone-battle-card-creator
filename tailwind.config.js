/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bone: {
          50: '#f9f9f7',
          100: '#f1f0ea',
          200: '#e1dfd2',
          300: '#c9c6b0',
          400: '#ada88b',
          500: '#948e6d',
          600: '#767154',
          700: '#5f5b45',
          800: '#4e4b3b',
          900: '#403d32',
        },
        rarity: {
          common: '#94a3b8',
          rare: '#3b82f6',
          epic: '#a855f7',
          legendary: '#eab308'
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-cinzel)', 'serif'],
      }
    },
  },
  plugins: [],
}
