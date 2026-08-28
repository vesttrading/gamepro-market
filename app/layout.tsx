import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GamePro Market",
  description: "Покупай и продавай достижения WoW",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-gradient-to-b from-blue-900 to-[#0a0f1e] text-white min-h-screen">
        
        {/* ШАПКА */}
        <header className="border-b border-gray-800 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎮</span>
              <span className="text-xl font-bold text-blue-400">GAMEPRO</span>
              <span className="text-xl font-bold">MARKET</span>
            </div>
            <div>
              <select className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-white">
                <option>RU</option>
                <option>EN</option>
              </select>
            </div>
          </div>
        </header>

        {/* КОНТЕНТ СТРАНИЦЫ */}
       <main className="container mx-auto px-4 py-8 max-w-5xl">
          {children}
        </main>

      </body>
    </html>
  );
}
