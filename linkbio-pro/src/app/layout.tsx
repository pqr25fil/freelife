import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LinkBio Pro - One Link for Everything You Create",
  description: "Create a beautiful, customizable page to share all your important links. Perfect for Instagram, TikTok, Twitter, and more.",
  keywords: ["link in bio", "linktree alternative", "bio link", "social media links"],
  openGraph: {
    title: "LinkBio Pro - One Link for Everything",
    description: "Create a beautiful page to share all your links",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
