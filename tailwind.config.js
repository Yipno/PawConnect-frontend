/** @type {import('tailwindcss').Config} */
import colors from './constants/colors';
import typography from './constants/typography';

module.exports = {
  content: ['./App.js', './components/**/*.{js,jsx,ts,tsx}', './screens/*.js'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors,
      fontSize: typography,
      fontFamily: { manrope: ['Manrope-Regular'], 'manrope-bold': ['Manrope-Bold'] },
      keyframes: {
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-100px)' },
          '100%': { transform: 'translateY(0px)' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
