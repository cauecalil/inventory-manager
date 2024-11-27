'use client'

import { useSession, signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useNotifications } from '@/contexts/NotificationContext'

export default function SessionTimer() {
  const { data: session } = useSession()
  const { addNotification } = useNotifications()
  const [notified, setNotified] = useState(false)

  useEffect(() => {
    if (session?.expiresAt) {
      const interval = setInterval(() => {
        const now = Date.now()
        const expiresAt = session.expiresAt as number
        const minutesLeft = Math.floor((expiresAt - now) / (1000 * 60))
        
        // Avisa quando faltar 15 minutos
        if (minutesLeft === 15 && !notified) {
          addNotification('info', 'Sua sessão irá expirar em 15 minutos!')
          setNotified(true)
        }

        // Faz logout quando o tempo acabar
        if (minutesLeft <= 0) {
          signOut({ redirect: true, callbackUrl: '/login' })
          addNotification('info', 'Sua sessão expirou. Por favor, faça login novamente.')
        }
      }, 60000) // Verifica a cada minuto

      return () => clearInterval(interval)
    }
  }, [session, addNotification, notified])

  return null
} 