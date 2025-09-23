// app/layout.tsx
import '../styles/globals.css'

export const metadata = {
  title: 'FocusAI',
  description: 'Stop procrastinating and stay on schedule',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
