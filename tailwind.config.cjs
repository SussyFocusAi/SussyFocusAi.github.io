/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
        mono: ["Menlo", "Monaco", "Courier New", "monospace"],
      },
      colors: {
        purple: {
          600: "#8b5cf6",
          700: "#7c3aed",
        },
        blue: {
          600: "#3b82f6",
          700: "#2563eb",
        },
      },
      backgroundImage: {
        "gradient-br": "linear-gradient(to bottom right, var(--tw-gradient-stops))",
      },
      boxShadow: {
        "lg-glass": "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
