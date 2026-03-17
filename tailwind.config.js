/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          2: '#F3F4F6',
          dark: '#1F2937',
          'dark-2': '#111827',
        },
        border: {
          DEFAULT: '#E5E7EB',
          dark: '#374151',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.07)',
        modal: '0 20px 60px -10px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
};
