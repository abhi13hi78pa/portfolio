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
        background: '#070913',
        card: '#0d1322',
        'card-hover': '#111a30',
        border: '#1b253b',
        primary: {
          DEFAULT: '#00a2ff',
          hover: '#008fe0',
          muted: 'rgba(0, 162, 255, 0.15)',
        },
        navy: {
          900: '#070913',
          800: '#0d1322',
          700: '#141d33',
          600: '#1b253b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
