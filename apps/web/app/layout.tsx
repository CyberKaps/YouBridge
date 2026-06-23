import type { Metadata } from "next";
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
  title: "YouBridge - Editor/YouTuber Collaboration",
  description: "Seamlessly connect Editors and YouTubers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="container flex flex-col items-center justify-center">
          {children}
        </main>
      </body>
    </html>
  );
}
