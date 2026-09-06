/** @type {import('tailwindcss').Config} */
module.exports = {
  // Aapke project ke paths ke hisaab se content update karein
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
}