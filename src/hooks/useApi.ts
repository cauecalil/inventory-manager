'use client'

import { useState, useEffect, useCallback } from 'react'

export function useApi<T>(url: string, options?: RequestInit) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (page?: number) => {
    try {
      setLoading(true)
      const finalUrl = page ? `${url}?page=${page}` : url
      const response = await fetch(finalUrl, options)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao carregar dados')
      }
      
      const jsonData = await response.json()
      setData(jsonData)
      setError(null)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }, [url, options])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
} 