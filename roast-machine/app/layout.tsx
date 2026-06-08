import type { Metadata } from 'next'
import { DM_Serif_Display, DM_Mono } from 'next/font/google'
import './globals.css'

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
})

const dmMono = DM_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Hustle Bro Roast Machine™',
  description: 'Leveraging AI to disrupt cringe at scale.',
  openGraph: {
    title: 'Hustle Bro Roast Machine™',
    description: 'Generate devastating corporate-speak roasts for AI hustle bro posts.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
