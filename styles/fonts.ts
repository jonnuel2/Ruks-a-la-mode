import { Inter, Bungee, Honk } from "next/font/google";

// define your variable fonts
const inter = Inter({ subsets: ["latin"] });
const bungee = Bungee({
  weight: "400",
  subsets: ["latin", "latin-ext", "vietnamese"],
});
const honk = Honk({
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: false,
});
// define 2 weights of a non-variable font
// define a custom local font where GreatVibes-Regular.ttf is stored in the styles folder
// const greatVibes = localFont({ src: './GreatVibes-Regular.ttf' })

export { inter, bungee, honk };
