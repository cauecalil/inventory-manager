'use client'

import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faCircleCheck, 
  faCircleXmark, 
  faCircleInfo,
  faClock,
  faX
} from '@fortawesome/free-solid-svg-icons'

interface Notification {
  id: string
  title: string
  message: string
  type: 'success' | 'error' | 'info'
  timestamp: Date
  read: boolean
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onClearAll: () => void
}

export default function NotificationCenter({ 
  isOpen, 
  onClose,
  notifications,
  onMarkAsRead,
  onClearAll
}: NotificationCenterProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return faCircleCheck
      case 'error':
        return faCircleXmark
      default:
        return faCircleInfo
    }
  }

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-[#22c55e]'
      case 'error':
        return 'text-red-400'
      default:
        return 'text-blue-400'
    }
  }

  const formatTimestamp = (date: Date) => {
    return new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })
      .format(-Math.round((Date.now() - date.getTime()) / (1000 * 60)), 'minutes')
  }

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read)

  if (!isOpen) return null

  return (
    <div className="absolute right-0 mt-2 w-96 bg-[#1A1C1E] rounded-lg shadow-xl border border-gray-700/50 z-50">
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-white">Notificações</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <FontAwesomeIcon icon={faX} className="h-4 w-4" />
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-sm ${
              filter === 'all' 
                ? 'bg-[#22c55e]/10 text-[#22c55e]' 
                : 'text-gray-400 hover:bg-white/5'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-lg text-sm ${
              filter === 'unread' 
                ? 'bg-[#22c55e]/10 text-[#22c55e]' 
                : 'text-gray-400 hover:bg-white/5'
            }`}
          >
            Não lidas
          </button>
          <button
            onClick={onClearAll}
            className="px-3 py-1 rounded-lg text-sm text-gray-400 hover:bg-white/5 ml-auto"
          >
            Limpar todas
          </button>
        </div>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            Nenhuma notificação encontrada
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-700/50 last:border-0 ${
                !notification.read ? 'bg-[#22c55e]/5' : ''
              }`}
              onClick={() => onMarkAsRead(notification.id)}
            >
              <div className="flex gap-3">
                <FontAwesomeIcon 
                  icon={getIcon(notification.type)} 
                  className={`h-5 w-5 ${getTypeStyle(notification.type)}`} 
                />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-white mb-1">
                    {notification.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <FontAwesomeIcon icon={faClock} className="h-3 w-3 mr-1" />
                    {formatTimestamp(notification.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
} 