
 import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "GamePro Market",
  description: "Паспорт профессионального геймера",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ru">
  <body>
  <Providers>{children}</Providers>
  </body>
    </html>
  );
}
