import type { Metadata, Viewport } from "next";
import { Anton, Instrument_Serif, Space_Grotesk } from "next/font/google";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });
const instrument = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Molten — Small-Batch Gourmet Hot Sauce",
  description:
    "Fire-roasted, slow-simmered, hand-sealed. Molten crafts small-batch gourmet sauces with heat worth savoring.",
};

export const viewport: Viewport = {
  themeColor: "#0a0706",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${anton.variable} ${grotesk.variable} ${instrument.variable}`}>
      <body>{children}</body>
    </html>
  );
}
