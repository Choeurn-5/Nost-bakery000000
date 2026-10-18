import type { Metadata } from "next";
import * as React from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "NOST Bakery & Pastry — Siem Reap",
  description: "Artisan Bakery & Pastry in Siem Reap, Cambodia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=Kantumruy+Pro:ital,wght@0,300..700;1,300..700&family=Noto+Serif+Khmer:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-warm-white text-espresso antialiased">
        {children}
      </body>
    </html>
  );
}

