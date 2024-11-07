'use client'

import Sidebar from './Sidebar'
import Header from './Header'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid lg:grid-cols-[auto_1fr] h-screen bg-[#1A1C1E] text-white">
      <Sidebar />
      <div className="flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#1A1C1E] p-6">
          {children}
        </main>
      </div>
    </div>
  )
}