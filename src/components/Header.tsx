'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faSearch } from '@fortawesome/free-solid-svg-icons'
import { useState, useEffect, useRef } from 'react'
import SearchResults from './SearchResults'
import { useDebounce } from '@/hooks/useDebounce'

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const searchItems = async () => {
      if (debouncedSearchTerm.length < 2) {
        setResults([])
        return
      }

      setIsSearching(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedSearchTerm)}`)
        const data = await response.json()
        setResults(data)
        setShowResults(true)
      } catch (error) {
        console.error('Erro na pesquisa:', error)
        setResults([])
      } finally {
        setIsSearching(false)
      }
    }

    searchItems()
  }, [debouncedSearchTerm])

  return (
    <header className="bg-[#1E2023] border-b border-gray-700 py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div className="relative ml-4 flex-1 max-w-lg z-50" ref={searchRef}>
            <input
              type="text"
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowResults(true)}
              className="w-full bg-[#1A1C1E] border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-[#22c55e]"
            />
            <FontAwesomeIcon 
              icon={faSearch} 
              className={`absolute left-3 top-2.5 ${
                isSearching ? 'text-[#22c55e]' : 'text-gray-400'
              } h-5 w-5`}
            />
            {showResults && (
              <SearchResults 
                results={results} 
                onClose={() => setShowResults(false)} 
              />
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/5 rounded-lg">
            <FontAwesomeIcon icon={faBell} className="text-gray-400 h-5 w-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gray-500" />
        </div>
      </div>
    </header>
  )
}