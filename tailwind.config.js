const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    colors: {
      ...colors,
      gray: colors.stone,
    },
    extend: {
      animation: {
        "fade-in": "fade-in 150ms ease-in",
        "slide-from-left": "slide-from-left 150ms ease-in",
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "slide-from-left": {
          "0%": { opacity: 0, transform: "translate(-50%, 0)" },
          "100%": { opacity: 1, transform: "translate(0, 0)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/line-clamp")],
};
