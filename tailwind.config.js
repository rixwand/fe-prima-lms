/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // ✅ scan everything inside src/
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        lg: "1024px",
        xl: "1024px",
        "2xl": "1024px",
      },
    },
  },
  plugins: [],
};
