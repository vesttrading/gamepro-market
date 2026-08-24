
export const metadata = {
  title: 'GamePro Market',
  description: 'Marketplace for pro players',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
