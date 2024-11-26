'use client'

import { useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faBell, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { useDebounce } from '@/hooks/useDebounce'
import SearchResults from './SearchResults'
import { signOut } from 'next-auth/react'
import Image from 'next/image'

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-full overflow-hidden hover:ring-2 hover:ring-[#22c55e] transition-all"
      >
        <Image
          src="/placeholder-avatar.png"
          alt="Avatar do usuário"
          width={32}
          height={32}
          className="object-cover"
        />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#1A1C1E] rounded-lg shadow-lg border border-gray-700 py-1 z-50">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-gray-400 hover:bg-[#22c55e]/10 hover:text-[#22c55e] flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="h-4 w-4" />
            Sair
          </button>
        </div>
      )}
    </div>
  )
}

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
        <div className="flex items-center flex-1" ref={searchRef}>
          <div className="relative max-w-md w-full">
            <div className="relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1A1C1E] text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] focus:outline-none transition-colors"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-500 border-t-[#22c55e]"></div>
                </div>
              )}
            </div>
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
          <UserMenu />
        </div>
      </div>
    </header>
  )
}