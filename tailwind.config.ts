import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        coffee: "#1B1B1B",
        lightgrey: "#F7F7F7",
        dark: "#0e0e0e",
      },
    },
  },
  plugins: [],
} satisfies Config;
