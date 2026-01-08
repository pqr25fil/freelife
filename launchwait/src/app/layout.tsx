import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "LaunchWait - Beautiful Waitlist Pages for Startups",
  description: "Create stunning waitlist landing pages in minutes. Collect emails, track analytics, and launch your startup with style.",
  keywords: ["waitlist", "landing page", "startup", "email collection", "launch page"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
