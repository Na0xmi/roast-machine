import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ハッスルブロ・ローストマシン™ | Hustle Bro Roast Machine',
  description: 'AIが生成したビジネス系投稿を優雅に破壊するサービス — Leveraging AI to disrupt cringe at scale.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
