import { Syne } from "next/font/google";

export const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"], // includes ExtraBold (800)
  variable: "--font-syne",
});
