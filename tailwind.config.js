module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {},
  },
//  darkMode: 'class',
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/line-clamp")],
};
