'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faSearch } from '@fortawesome/free-solid-svg-icons'

export default function Header() {
  return (
    <header className="bg-[#1E2023] border-b border-gray-700 py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative ml-4">
            <input
              type="text"
              placeholder="Pesquisar..."
              className="w-full lg:w-96 bg-[#1A1C1E] border border-gray-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-[#22c55e]"
            />
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
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