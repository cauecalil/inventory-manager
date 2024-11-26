'use client'

import { useState, useRef, useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faSignOut, 
  faBell,
  faChevronDown,
  faGear
} from '@fortawesome/free-solid-svg-icons'
import NotificationCenter from './NotificationCenter'

const mockNotifications = [
  {
    id: '1',
    title: 'Novo produto adicionado',
    message: 'O produto "Notebook Dell" foi adicionado ao estoque',
    type: 'success' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false
  },
  {
    id: '2',
    title: 'Erro na transação',
    message: 'Não foi possível processar a última transação',
    type: 'error' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false
  },
  {
    id: '3',
    title: 'Atualização do sistema',
    message: 'Uma nova versão do sistema está disponível',
    type: 'info' as const,
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    read: true
  }
]

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)
  const menuRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        notificationRef.current && 
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const handleClearAll = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter(n => !n.read).length
  const userInitial = session?.user?.name?.charAt(0) || 'U'

  return (
    <div className="flex items-center gap-4" ref={menuRef}>
      {/* Notification Button */}
      <div className="relative" ref={notificationRef}>
        <button 
          className="relative p-2 hover:bg-white/5 rounded-lg transition-colors"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <FontAwesomeIcon 
            icon={faBell} 
            className="text-gray-400 hover:text-white h-5 w-5" 
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#22c55e] text-white text-xs flex items-center justify-center rounded-full">
              {unreadCount}
            </span>
          )}
        </button>

        <NotificationCenter
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          notifications={notifications}
          onMarkAsRead={handleMarkAsRead}
          onClearAll={handleClearAll}
        />
      </div>
      
      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 py-1.5 px-2 hover:bg-white/5 rounded-lg transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#22c55e]/80 to-[#22c55e] flex items-center justify-center text-white font-medium shadow-lg">
            {userInitial}
          </div>
          
          <div className="hidden md:block text-left">
            <div className="text-sm font-medium text-white group-hover:text-[#22c55e] transition-colors">
              {session?.user?.name || 'Usuário'}
            </div>
            <div className="text-xs text-gray-400">
              {session?.user?.email || 'usuário@email.com'}
            </div>
          </div>
          
          <FontAwesomeIcon 
            icon={faChevronDown} 
            className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-[#1A1C1E] rounded-lg shadow-xl border border-gray-700/50 py-1 z-50">
            {/* Mobile User Info */}
            <div className="md:hidden px-4 py-2 border-b border-gray-700/50">
              <div className="text-sm font-medium text-white">
                {session?.user?.name || 'Usuário'}
              </div>
              <div className="text-xs text-gray-400">
                {session?.user?.email || 'usuário@email.com'}
              </div>
            </div>

            <div className="py-1">
              <button
                onClick={() => {}}
                className="w-full text-left px-4 py-2 text-gray-400 hover:bg-[#22c55e]/10 hover:text-[#22c55e] flex items-center gap-3 transition-colors"
              >
                <FontAwesomeIcon icon={faGear} className="h-4 w-4" />
                <span>Configurações</span>
              </button>

              <div className="h-px bg-gray-700/50 my-1"></div>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-400 hover:bg-red-500/10 hover:text-red-400 flex items-center gap-3 transition-colors"
              >
                <FontAwesomeIcon icon={faSignOut} className="h-4 w-4" />
                <span>Sair da conta</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 