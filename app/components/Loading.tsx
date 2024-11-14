'use client'

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-full min-h-[200px] bg-[#141517] rounded-xl p-6">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-[#1A1C1E] border-t-[#22c55e] animate-spin"></div>
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-6 h-6 rounded-full border-2 border-[#1A1C1E] border-t-[#22c55e] animate-spin"></div>
        </div>
      </div>
      
      <div className="mt-4 text-gray-400 text-sm font-medium">
        Carregando...
      </div>
    </div>
  )
}