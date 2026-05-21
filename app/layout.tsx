import type { Metadata } from "next";
import { AppThemeProvider } from "@/components/AppThemeProvider";
import { Big_Shoulders, Caveat, DM_Sans, DM_Serif_Display, Space_Mono } from "next/font/google";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

const bigShouldersDisplay = Big_Shoulders({
  variable: "--font-cond",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap"
});

const caveat = Caveat({
  variable: "--font-hand",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap"
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap"
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "with-chaos",
  description: "A tiny single-event invite and RSVP app."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.className} ${dmSerifDisplay.variable} ${bigShouldersDisplay.variable} ${caveat.variable} ${dmSans.variable} ${spaceMono.variable}`}
      >
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  );
}
