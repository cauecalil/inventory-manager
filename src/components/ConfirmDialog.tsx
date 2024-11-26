'use client'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message
}: ConfirmDialogProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-gradient-to-b from-[#1E2023] to-[#17181B] rounded-xl border border-gray-700/50 shadow-xl p-6 w-full max-w-md relative animate-scale-up">
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gray-500/30 to-transparent" />
          
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent mb-6" />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-800 rounded-lg transition-all border border-gray-700/50 hover:border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-700/50 focus:ring-offset-2 focus:ring-offset-[#1E2023]"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 rounded-lg transition-all shadow-lg shadow-red-500/20 hover:shadow-red-500/30 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-[#1E2023] animate-pulse-subtle"
              onClick={() => {
                onConfirm()
                onClose()
              }}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 