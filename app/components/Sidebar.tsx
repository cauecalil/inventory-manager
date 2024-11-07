'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faHome, 
  faBox, 
  faList, 
  faChartLine, 
  faTruck 
} from '@fortawesome/free-solid-svg-icons'

const menuItems = [
  { href: '/dashboard', icon: faHome, label: 'Painel' },
  { href: '/products', icon: faBox, label: 'Produtos' },
  { href: '/categories', icon: faList, label: 'Categorias' },
  { href: '/suppliers', icon: faTruck, label: 'Fornecedores' },
  { href: '/transactions', icon: faChartLine, label: 'Transações' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className={`lg:block h-screen min-h-full`}>
      <div className="flex h-full w-64 flex-col bg-[#1E2023] p-4">
        <div className="flex items-center gap-2 mb-8">
          <Image src="/logo.png" alt="GOATECH Logo" width={40} height={40} />
          <span className="text-[#22c55e] font-semibold">GOATECH</span>
        </div>
        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                pathname === item.href ? 'bg-[#22c55e]/10 text-[#22c55e]' : 'text-gray-400 hover:bg-white/5'
              }`}
            >
              <FontAwesomeIcon icon={item.icon} className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}