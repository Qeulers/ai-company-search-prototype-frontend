/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F88E63",
          50: "#FFF3EF",
          100: "#FFE6DD",
          200: "#FDD0C2",
          300: "#FBB9A6",
          400: "#FAA28A",
          500: "#F88E63",
          600: "#F0723F",
          700: "#D95A2B",
          800: "#B6461F",
          900: "#8C3416",
        },
        secondary: {
          DEFAULT: "#0D9488",
          50: "#E6F7F6",
          100: "#CCEFED",
          200: "#99DFDB",
          300: "#66CFC9",
          400: "#33BFB7",
          500: "#0D9488",
          600: "#0A766D",
          700: "#085952",
          800: "#053B36",
          900: "#031E1B",
        },
        brand: {
          dark: "#0A292B",
        },
        success: "#16A34A",
        warning: "#D97706",
        error: "#DC2626",
      },
    },
  },
  plugins: [],
};
