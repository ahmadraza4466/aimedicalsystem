import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";
import { colors as defaultColors } from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            ...defaultColors,
            background: "#FFFFFF",
            foreground: "#2D374C",
          },
        },
        dark: {
          colors: {
            ...defaultColors,
            background: "#191919",
            foreground: "#FFFFFF",
          },
        },
      },
    }),
    require("tailwind-scrollbar"),
  ],
};
export default config;
