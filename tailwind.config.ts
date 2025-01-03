import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      sans: [
        "Helvetica Neue",
        "Arial",
        "Hiragino Kaku Gothic ProN",
        "Hiragino Sans",
        "Meiryo",
        "sans-serif",
      ],
    },
    extend: {
      colors: {
        background: {
          DEFAULT: colors.zinc[900],
          muted: colors.zinc[700],
          hover: colors.zinc[800],
        },
        foreground: {
          DEFAULT: colors.zinc[300],
          strong: colors.zinc[50],
          muted: colors.zinc[400],
        },
        border: {
          DEFAULT: colors.zinc[700],
          strong: colors.zinc[500],
        },

        navbar: {
          background: {
            DEFAULT: colors.zinc[900],
            hover: colors.zinc[700],
            muted: colors.zinc[600],
          },
          foreground: {
            DEFAULT: colors.zinc[100],
            muted: colors.zinc[400],
          },
          border: {
            DEFAULT: colors.zinc[500],
            muted: colors.zinc[600],
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
