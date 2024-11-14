'use client'

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-full min-h-[200px] bg-[#1E2023] rounded-xl p-6 border border-gray-700/50">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-[#1A1C1E] border-t-[#22c55e] animate-spin"></div>
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-8 h-8 rounded-full border-3 border-[#1A1C1E] border-t-[#22c55e] animate-spin"></div>
        </div>
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 rounded-full border-2 border-[#1A1C1E] border-t-[#22c55e] animate-spin"></div>
        </div>
      </div>
      
      <div className="mt-6 text-gray-400 font-medium flex items-center gap-2">
        <span className="animate-pulse">Carregando</span>
        <span className="flex gap-1">
          <span className="animate-bounce delay-100">.</span>
          <span className="animate-bounce delay-200">.</span>
          <span className="animate-bounce delay-300">.</span>
        </span>
      </div>
    </div>
  )
}