import type { Metadata } from "next";
import { baseMetadata } from "./metadata"
import "./globals.css";
import { WebsiteJsonLd } from "@/components/structured-data"

export const metadata: Metadata = baseMetadata

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <WebsiteJsonLd />
      </body>
    </html>
  );
}
