/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bible-blue': '#1e3a8a',
        'bible-purple': '#4c1d95',
        'bible-gold': '#f59e0b',
        'bible-white': '#ffffff',
      },
      fontFamily: {
        'sans': ['Montserrat', 'DM Sans', 'Inter', 'system-ui', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
