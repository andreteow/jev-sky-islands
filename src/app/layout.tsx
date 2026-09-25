import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Lilita_One, Nunito } from "next/font/google";
import "./globals.css";

const display = Lilita_One({ variable: "--font-display", subsets: ["latin"], weight: "400" });
const body = Nunito({ variable: "--font-body", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sky Island Hatchlings",
  description: "Hatch a creature and talk your way across 10 floating islands.",
};

export const viewport: Viewport = { themeColor: "#0f1a33" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
