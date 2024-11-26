'use client'

import { useRouter } from 'next/navigation'
import { SearchResult } from '@/types/search'

interface SearchResultsProps {
  results: SearchResult[]
  onClose: () => void
}

export default function SearchResults({ results, onClose }: SearchResultsProps) {
  const router = useRouter()

  const handleSelect = (link: string) => {
    router.push(link)
    onClose()
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      product: 'Produto',
      category: 'Categoria',
      supplier: 'Fornecedor'
    }
    return labels[type as keyof typeof labels] || type
  }

  if (results.length === 0) {
    return (
      <div className="absolute top-full left-0 w-full mt-2 bg-[#1A1C1E] rounded-lg shadow-lg border border-gray-700 p-4 z-50">
        <p className="text-gray-400">Nenhum resultado encontrado</p>
      </div>
    )
  }

  return (
    <div className="absolute top-full left-0 w-full mt-2 bg-[#1A1C1E] rounded-lg shadow-lg border border-gray-700 z-50 max-h-[300px] overflow-y-auto">
      {results.map((result) => (
        <button
          key={`${result.type}-${result.id}`}
          onClick={() => handleSelect(result.link)}
          className="w-full text-left p-4 hover:bg-[#22c55e]/10 border-b border-gray-700 last:border-0"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">{result.title}</div>
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