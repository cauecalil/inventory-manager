import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'

interface ErrorDisplayProps {
  title?: string
  message: string
  onRetry?: () => void
}

export default function ErrorDisplay({ 
  title = 'Erro ao carregar dados', 
  message, 
  onRetry 
}: ErrorDisplayProps) {
  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-3">
        <FontAwesomeIcon icon={faCircleExclamation} className="text-red-400 h-5 w-5" />
        <h2 className="text-red-400 font-medium">{title}</h2>
      </div>
      <p className="text-gray-400 mb-4">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Tentar novamente
        </button>
      )}
    </div>
  )
} 