import daisyui from 'daisyui';
import scrollbar from 'tailwind-scrollbar';
import tailwindcssRetina from 'tailwindcss-retina';

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {},
    screens: {
      sm: '360px',
      md: '768px',
      lg: '1178px',
    },
  },
  plugins: [scrollbar, daisyui, tailwindcssRetina],
};
