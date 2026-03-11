import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cena de despedida de Nuria",
  description: "Apúntate a la cena de despedida de Nuria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
