import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "YouBridge — Editor / YouTuber Collaboration",
  description: "Upload, review, and publish to YouTube seamlessly. The collaboration bridge between editors and creators.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <Navbar />
          <main className="container app-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
