import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GamePro Market",
  description: "Покупай и продавай достижения WoW",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="bg-[#0a0f1e] text-white font-sans antialiased">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </body>
    </html>
  );
}
