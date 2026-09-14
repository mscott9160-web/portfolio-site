import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const siteUrl = "https://myles-scott-portfolio.vercel.app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Myles B. Scott | Backend Engineer \u2014 Financial Systems & AI",
  description: "Backend engineer building real-time financial infrastructure and applied AI at USAA. Java, Spring Boot, Kafka, and LLM integration in regulated environments.",
  openGraph: {
    title: "Myles B. Scott | Backend Engineer \u2014 Financial Systems & AI",
    description: "Backend engineer building real-time financial infrastructure and applied AI at USAA. Java, Spring Boot, Kafka, and LLM integration in regulated environments.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
