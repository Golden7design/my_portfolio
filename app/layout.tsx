import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./Providers";
import PageTransition from "@/src/components/PageTransition/PageTransition";

export const metadata: Metadata = {
  title: "Nassir's Portfolio",
  description: "Freelance Developer & DevOps",
  icons: "/nash_white.svg",
};

const clashDisplay = localFont({
  src: [{ path: "./fonts/ClashDisplay/ClashDisplay-Bold.otf", weight: "700" }],
  variable: "--font-clash-display",
  display: "swap",
});

const gambarino = localFont({
  src: [{ path: "./fonts/Gambarino/Gambarino-Regular.otf" }],
  variable: "--font-gambarino",
  display: "swap",
});

const Generale_Sans = localFont({
  src: [
    { path: "./fonts/Generale_Sans/GeneralSans-Regular.otf", weight: "400" },
    { path: "./fonts/Generale_Sans/GeneralSans-Bold.otf", weight: "700" },
    { path: "./fonts/Generale_Sans/GeneralSans-BoldItalic.otf", weight: "700", style: "italic" },
    { path: "./fonts/Generale_Sans/GeneralSans-Light.otf", weight: "200"},
  ],
  variable: "--font-generale-sans",
  display: "swap",
});

const Generale_Sans_light = localFont({
  src: [
    { path: "./fonts/Generale_Sans/GeneralSans-Light.otf", weight: "100"},
  ],
  variable: "--font-generale-sans-light",
  display: "swap",
});

const Aeonik = localFont({
  src: [
    { path: "./fonts/Aeonik/fonnts.com-Aeonik-Regular.ttf", weight: "400" },
    { path: "./fonts/Aeonik/fonnts.com-Aeonik-Bold.ttf", weight: "700" },
  ],
  variable: "--font-aeonik",
  display: "swap",
});
const Anton = localFont({
  src: [
    { path: "./fonts/Anton/Anton-Regular.ttf", weight: "400" },
  ],
  variable: "--font-anton",
  display: "swap",
});

const dancing = localFont({
  src: [
    { path: "./fonts/Dancing_Script/DancingScript-VariableFont_wght.ttf", weight: "400" },
  ],
  variable: "--font-dancing",
  display: "swap",
});



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
            <head>
        {/* CRITIQUE : Script qui s'exécute AVANT React */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const isRefresh = performance.getEntriesByType('navigation')[0]?.type === 'reload';
                const hasSeenLoader = sessionStorage.getItem('hasSeenLoader');
                
                if (isRefresh || !hasSeenLoader) {
                  document.documentElement.classList.add('initial-load');
                }
              })();
            `
          }}
        />
      </head>
      <body
        className={`
          ${clashDisplay.variable}
          ${Aeonik.variable}
          ${Generale_Sans.variable}
          ${gambarino.variable}
          ${Generale_Sans_light.variable}
          ${Anton.variable}
          ${dancing.variable}
          antialiased h-full
        `}
      >
        <PageTransition/>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}