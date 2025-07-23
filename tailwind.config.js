/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#204499FF',
        'primary-dark': '#1a3a7f',
        'primary-light': '#2d52b8',
      }
    },
  },
  plugins: [],
}