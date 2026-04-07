/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  // Cache-busting comment for rebuild: 1775415229898
  theme: {
    extend: {
      colors: {
        primary: "#1a1a2e",
        secondary: "#16213e",
        accent: "#0f3460",
        highlight: "#e94560",
      },
      backgroundImage: {
        'premium-gradient': "linear-gradient(135deg, #1a1a2e 0%, #000000 100%)",
      }
    },
  },
  plugins: [],
}
