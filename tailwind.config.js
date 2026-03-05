/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        grift: ["Grift-Regular"],
        medium: ["Grift-Medium"],
        black: ["Grift-Black"],
        light: ["Grift-Light"],
        extralight: ["Grift-Extralight"],
        bold: ["Grift-Bold"],
      },
      colors: {
        primary: {
          DEFAULT: "#1B4332",
          light: "#2D6A4F",
          tint: "#E8F5E9",
        },
        accent: {
          DEFAULT: "#F59E0B",
          light: "#FEF3C7",
        },
        background: "#f2f2eb",
        surface: "#FFFFFF",
        text: {
          primary: "#1A1A1A",
          secondary: "#6B7280",
          muted: "#9CA3AF",
        },
        success: "#4ADE80",
        error: "#E05C2D",
        border: "#E5E7EB",
      },
    },
  },
  plugins: [],
};
