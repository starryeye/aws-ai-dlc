/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pending: { light: '#FEF3C7', DEFAULT: '#F59E0B', dark: '#B45309' },
        preparing: { light: '#DBEAFE', DEFAULT: '#3B82F6', dark: '#1D4ED8' },
        completed: { light: '#D1FAE5', DEFAULT: '#10B981', dark: '#047857' },
      },
    },
  },
  plugins: [],
};
