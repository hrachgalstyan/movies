import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
    colors: {
      background: "#093545",
      primary: "#2BD17E",
      secondary: "#224957",
      error: "#EB5757",
      white: "#ffffff",
      input: "#224957",
      card: "#092C39",
      cardHover: "rgba(8, 41, 53, 0.55)",
    },
  },
  // plugins: [require("@tailwindcss/forms")],
};
export default config;
