import './globals.css'
import { Inter } from 'next/font/google'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { AuthProvider } from '@/contexts/AuthContext'
import SessionTimer from '@/components/SessionTimer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Gerenciador de Estoque',
  description: 'Sistema de gerenciamento de estoque para pequenos negócios',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-background text-text-primary`}>
        <NotificationProvider>
          <AuthProvider>
            {children}
            <SessionTimer />
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  )
}