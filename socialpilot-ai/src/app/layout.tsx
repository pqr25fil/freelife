import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'SocialPilot AI - Генератор контента для социальных сетей',
  description: 'Создавайте вирусный контент для Twitter, LinkedIn и Instagram за секунды с помощью AI. Экономьте время и увеличивайте охваты.',
  keywords: 'AI контент, генератор постов, социальные сети, SMM, маркетинг',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
