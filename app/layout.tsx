import '@/app/globals.css'  // Update the import path
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Taupo Thai Restaurant',
  description: 'Experience authentic Thai cuisine in the heart of Taupo',
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