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
        brand: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#dbe4ff',
          300: '#bfceff',
          400: '#9fb2ff',
          500: '#6366f1', // Indigo primary
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        darkbg: {
          base: '#0f172a',    // Slate 900
          card: '#1e293b',    // Slate 800
          border: '#334155',  // Slate 700
          text: '#f8fafc',    // Slate 50
          muted: '#94a3b8'    // Slate 400
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(99, 102, 241, 0.08), 0 2px 10px -1px rgba(0, 0, 0, 0.04)',
        'premium-hover': '0 10px 30px -5px rgba(99, 102, 241, 0.15), 0 4px 15px -2px rgba(0, 0, 0, 0.05)',
        'premium-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.4), 0 2px 10px -1px rgba(0, 0, 0, 0.2)',
      }
    },
  },
  plugins: [],
}
