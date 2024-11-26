'use client'

import { useRouter } from 'next/navigation'

interface SearchResult {
  id: number
  type: 'product' | 'category' | 'supplier' | 'transaction'
  title: string
  subtitle?: string
  link: string
}

interface SearchResultsProps {
  results: SearchResult[]
  onClose: () => void
}

export default function SearchResults({ results, onClose }: SearchResultsProps) {
  const router = useRouter()

  const handleSelect = (link: string) => {
    try {
      const url = new URL(link, window.location.origin)
      if (url.pathname.startsWith('/')) {
        router.push(link)
        onClose()
      } else {
        console.error('URL inválida')
      }
    } catch (error) {
      console.error('Erro ao processar URL:', error)
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'product': return 'Produto'
      case 'category': return 'Categoria'
      case 'supplier': return 'Fornecedor'
      case 'transaction': return 'Transação'
      default: return type
    }
  }

  if (results.length === 0) {
    return (
      <div className="absolute top-full left-0 w-full mt-2 bg-[#1A1C1E] rounded-lg shadow-lg border border-gray-700 p-4">
        <p className="text-gray-400">Nenhum resultado encontrado</p>
      </div>
    )
  }

  return (
    <div className="absolute top-full left-0 w-full mt-2 bg-[#1A1C1E] rounded-lg shadow-lg border border-gray-700 z-50">
      {results.map((result) => (
        <button
          key={`${result.type}-${result.id}`}
          onClick={() => handleSelect(result.link)}
          className="w-full text-left p-4 hover:bg-[#22c55e]/10 border-b border-gray-700 last:border-0 relative"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white">{result.title}</div>
              {result.subtitle && (
                <div className="text-sm text-gray-400">{result.subtitle}</div>
              )}
            </div>
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
              {getTypeLabel(result.type)}
            </span>
          </div>
        </button>
      ))}
    </div>
  )
} 