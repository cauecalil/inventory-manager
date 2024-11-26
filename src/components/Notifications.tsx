'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faCircleXmark, faInfoCircle, faX } from '@fortawesome/free-solid-svg-icons'
import { NotificationType } from '@/contexts/NotificationContext'

interface Notification {
  id: string
  type: NotificationType
  message: string
}

interface NotificationsProps {
  notifications: Notification[]
  onRemove: (id: string) => void
}

export default function Notifications({ notifications, onRemove }: NotificationsProps) {
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return faCheckCircle
      case 'error':
        return faCircleXmark
      case 'info':
        return faInfoCircle
    }
  }

  const getColors = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'bg-[#1E2023] border-[#22c55e] text-[#22c55e]'
      case 'error':
        return 'bg-[#1E2023] border-red-500 text-red-400'
      case 'info':
        return 'bg-[#1E2023] border-blue-500 text-blue-400'
    }
  }

  return (
    <div className="fixed right-6 bottom-6 z-50 space-y-3 w-full max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getColors(
            notification.type
          )} p-4 rounded-xl border shadow-lg flex items-center gap-3 animate-slide-up`}
        >
          <FontAwesomeIcon icon={getIcon(notification.type)} className="h-5 w-5 flex-shrink-0" />
          <p className="flex-1 text-gray-300 text-sm">{notification.message}</p>
          <button
            onClick={() => onRemove(notification.id)}
            className="text-gray-400 hover:text-gray-300 transition-colors flex-shrink-0"
          >
            <FontAwesomeIcon icon={faX} className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
} 