/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./**/*.{html,js,jsx,ts,tsx}",
    "!./node_modules/**",
    "!./dist/**",
    "!./.git/**",
    "!./.netlify/**",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        "odec-blue": {
          900: "#0A2463",
          800: "#1E3A8A",
          700: "#1D4ED8",
        },
        "odec-gold": {
          50:  "#FFFBEB", // Very light tint
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#FFD700",
          600: "#FBBF24",
        },
        "odec-white": {
          50: "#FAFAFA",
          100: "#F5F5F5",
          DEFAULT: "#FFFFFF",
        }
      },
    },
  },
  plugins: [],
};
