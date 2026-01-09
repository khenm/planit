/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: colors.slate,
        sky: colors.sky,
        brand: {
          dark: '#333333',
          gray: '#b0bec5',
          primary: '#5f7c8c',
          white: '#ffffff',
        }
      },
      fontFamily: {
        sans: ['"Bricolage Grotesque"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
