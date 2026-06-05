import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RenaCare - Böbrek Nakli Hasta Takip Sistemi",
  description:
    "Böbrek nakli hastaları için ilaç takibi, beslenme rehberi ve AI destekli sağlık asistanı",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased text-slate-900">{children}</body>
    </html>
  );
}
