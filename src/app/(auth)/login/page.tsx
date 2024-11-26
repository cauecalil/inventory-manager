'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'

export default function Login() {
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('password'),
        redirect: false,
        callbackUrl: '/dashboard'
      })

      if (result?.error) {
        setError('Credenciais inválidas')
        return
      }

      if (result?.ok) {
        router.push('/dashboard')
        router.refresh()
      }
    } catch (error) {
      console.error('Erro no login:', error)
      setError('Ocorreu um erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1C1E]">
      <div className="bg-[#1E2023] p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700/50">
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="GOATECH Logo" width={80} height={80} className="mb-4" />
          <h1 className="text-3xl font-bold text-white">
            Bem-vindo de volta
          </h1>
          <p className="text-gray-400 mt-2">
            Entre com suas credenciais para acessar
          </p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm text-center">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Email
            </label>
            <div className="relative">
              <FontAwesomeIcon 
                icon={faEnvelope} 
                className="absolute left-3 top-3 text-gray-400 h-5 w-5" 
              />
              <input
                type="email"
                name="email"
                required
                className="w-full bg-[#1A1C1E] border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Senha
            </label>
            <div className="relative">
              <FontAwesomeIcon 
                icon={faLock} 
                className="absolute left-3 top-3 text-gray-400 h-5 w-5" 
              />
              <input
                type="password"
                name="password"
                required
                className="w-full bg-[#1A1C1E] border border-gray-700 rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#22c55e] text-white py-3 px-4 rounded-lg hover:bg-[#22c55e]/90 transition-colors
              ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} 
              focus:outline-none focus:ring-2 focus:ring-[#22c55e]/50 focus:ring-offset-2 focus:ring-offset-[#1E2023]`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                Entrando...
              </div>
            ) : (
              'Entrar'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}