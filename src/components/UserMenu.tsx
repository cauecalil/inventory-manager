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

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()

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

  const userInitial = session?.user?.name?.charAt(0) || 'U'

  return (
    <div className="flex items-center gap-4" ref={menuRef}>
      <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
        <FontAwesomeIcon icon={faBell} className="text-gray-400 hover:text-white h-5 w-5" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-[#22c55e] rounded-full"></span>
      </button>
      
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

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-[#1A1C1E] rounded-lg shadow-xl border border-gray-700/50 py-1 z-50">
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