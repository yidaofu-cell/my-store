import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AirVela Portable AC — Stay Cool Anywhere | 30% OFF Today",
  description:
    "The AirVela Portable AC delivers instant cooling for a fraction of the cost. Compact, energy-efficient, and powerful. 60-Day Money-Back Guarantee. Free Shipping over $50.",
  openGraph: {
    title: "AirVela Portable AC — Stay Cool Anywhere | 30% OFF",
    description:
      "Instant cooling, ultra-quiet, and energy efficient. Limited time 30% OFF.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-gray-900 font-sans">
        {children}
      </body>
    </html>
  );
}
