/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: ["./App.{js,jsx,ts,tsx}",
   "./screens/**/*.{js,jsx,ts,tsx}" ,
   "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    colors: {
    },
  },
  plugins: [],
}

