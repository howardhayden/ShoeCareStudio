import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShoeCareStudio — Leather shoe-care reference",
  description:
    "A local-first, accessibility-oriented pre-production leather shoe-care reference with fail-closed care semantics and a procedural Three.js renderer.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
