import { ReactNode } from "react";
import "./globals.css";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Skyscraper Solver</title>
        <meta name="description" content="A modern skyscraper puzzle solver" />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
} 