import type { Metadata } from "next";
import localFont from "next/font/local"
import "./globals.css";

export const metadata: Metadata = {
  title: "Nassir's Portfolio",
  description: "Freelance Developer & DevOps Junior",
  icons: "/nash_white.svg"
};

const clashDisplay = localFont({
  src: [
    {
        path: "./fonts/ClashDisplay/ClashDisplay-Bold.otf",
        weight: "700",
        style: "normal",
    }
  ],
  variable: "--font-clash-display",
  display: "swap",
});

const gambarino = localFont({
  src: [
    {
        path: "./fonts/Gambarino/Gambarino-Regular.otf",
        weight: "400",
        style: "normal",
    }
  ],
  variable: "--font-gambarino",
  display: "swap",
});
const Generale_Sans = localFont({
  src: [
    {
        path: "./fonts/Generale_Sans/GeneralSans-Bold.otf",
        weight: "700",
        style: "normal",
    },
    {
        path: "./fonts/Generale_Sans/GeneralSans-BoldItalic.otf",
        weight: "700",
        style: "italic",
    },
    {
        path: "./fonts/Generale_Sans/GeneralSans-Regular.otf",
        weight: "400",
        style: "normal",
    },
  ],
  variable: "--font-generale-sans",
  display: "swap",
});
const Aeonik = localFont({
  src: [
    {
        path: "./fonts/Aeonik/fonnts.com-Aeonik-Bold.ttf",
        weight: "700",
        style: "normal",
    },
    {
        path: "./fonts/Aeonik/fonnts.com-Aeonik-Regular.ttf",
        weight: "400",
        style: "normal",
    },
  ],
  variable: "--font-aeonik",
  display: "swap",
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${clashDisplay.variable} ${Aeonik.variable} ${Generale_Sans.variable} ${gambarino.variable} antialiased h-full `}
      >
        {children}
      </body>
    </html>
  );
}
