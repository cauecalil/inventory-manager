'use client'

import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import Table from '../components/Table'
import Modal from '../components/Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useApi } from '../hooks/useApi'
import { z } from 'zod'
import { formatMoney } from '../utils/formatters'
import ErrorDisplay from '../components/ErrorDisplay'

interface Transaction {
  id: number
  type: 'IN' | 'OUT'
  quantity: number
  unitPrice: number
  totalValue: number
  date: string
  product: {
    id: number
    name: string
    category: {
      name: string
    }
  }
}

const columns = [
  { 
    key: 'date', 
    label: 'Data',
    format: (value: string) => new Date(value).toLocaleString('pt-BR')
  },
  { 
    key: 'type', 
    label: 'Tipo',
    format: (value: string) => value === 'IN' ? 'Entrada' : 'Saída'
  },
  { key: 'product.name', label: 'Produto' },
  { key: 'quantity', label: 'Quantidade' },
  { 
    key: 'unitPrice', 
    label: 'Valor Unitário',
    format: (value: number) => formatMoney(value)
  },
  { 
    key: 'totalValue', 
    label: 'Valor Total',
    format: (value: number) => formatMoney(value)
  }
]

const transactionSchema = z.object({
  type: z.enum(['IN', 'OUT']),
  quantity: z.number().min(1, 'Quantidade deve ser maior que zero'),
  productId: z.number().min(1, 'Produto é obrigatório'),
  unitPrice: z.number().min(0.01, 'Valor unitário deve ser maior que zero'),
  totalValue: z.number().min(0.01, 'Valor total deve ser maior que zero'),
  date: z.string().optional()
})

export default function Transactions() {
  const { data: transactions, loading, error, refetch } = useApi<Transaction[]>('/api/transactions')
  const { data: products } = useApi<any[]>('/api/products')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [value, setValue] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (selectedProduct && quantity) {
      const type = (document.querySelector('select[name="type"]') as HTMLSelectElement)?.value as 'IN' | 'OUT'
      const unitPrice = type === 'IN' 
        ? Number(selectedProduct.buyPrice) 
        : Number(selectedProduct.sellPrice)
      
      const totalValue = unitPrice * quantity
      setValue(totalValue)
    }
  }, [selectedProduct, quantity])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormErrors({})
    setIsSubmitting(true)
  
    if (!selectedProduct) {
      setFormErrors({ productId: 'Selecione um produto' })
      return
    }
  
    const formData = new FormData(e.target as HTMLFormElement)
    const type = formData.get('type') as 'IN' | 'OUT'
    
    if (type === 'OUT' && selectedProduct.quantity < quantity) {
      setFormErrors({ quantity: 'Quantidade maior que o estoque disponível' })
      return
    }
  
    const unitPrice = type === 'IN' 
      ? Number(selectedProduct.buyPrice) 
      : Number(selectedProduct.sellPrice)
  
    const data = {
      type,
      quantity: Number(quantity),
      productId: Number(selectedProduct.id),
      unitPrice,
      totalValue: unitPrice * quantity,
      date: new Date().toISOString()
    }
  
    try {
      const validatedData = transactionSchema.parse(data)
      
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData)
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao registrar transação')
      }
      
      setIsModalOpen(false)
      setSelectedProduct(null)
      setQuantity(1)
      setValue(0)
      await refetch()
      alert('Transação registrada com sucesso!')
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        error.errors.forEach(err => {
          if (err.path) {
            errors[err.path[0]] = err.message
          }
        })
        setFormErrors(errors)
      } else {
        alert(error instanceof Error ? error.message : 'Erro ao registrar transação')
        console.error('Erro completo:', error)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (error) {
    return (
      <Layout>
        <ErrorDisplay 
          title="Erro ao carregar transações"
          message={error}
          onRetry={refetch}
        />
      </Layout>
    )
  }

  return (
    <Layout loading={loading}>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Transações</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#22c55e] hover:bg-[#22c55e]/90 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2 h-5 w-5" />
          Nova Transação
        </button>
      </div>

      <Table 
        columns={columns} 
        data={transactions || []} 
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false)
          setFormErrors({})
        }}
        title="Nova Transação"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400">Tipo</label>
            <select
              name="type"
              className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white"
              onChange={(e) => {
                if (selectedProduct && quantity) {
                  const type = e.target.value as 'IN' | 'OUT'
                  const unitPrice = type === 'IN' 
                    ? Number(selectedProduct.buyPrice) 
                    : Number(selectedProduct.sellPrice)
                  const totalValue = unitPrice * quantity
                  setValue(totalValue)
                }
              }}
            >
              <option value="IN">Entrada</option>
              <option value="OUT">Saída</option>
            </select>
            {formErrors.type && (
              <p className="text-red-400 text-sm mt-1">{formErrors.type}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400">Produto</label>
            <select
              name="productId"
              className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white"
              onChange={(e) => {
                const product = products?.find(p => p.id === Number(e.target.value))
                setSelectedProduct(product)
              }}
            >
              <option value="">Selecione um produto</option>
              {products?.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} - Estoque: {product.quantity}
                </option>
              ))}
            </select>
            {formErrors.productId && (
              <p className="text-red-400 text-sm mt-1">{formErrors.productId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400">Quantidade</label>
            <input
              type="number"
              name="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white"
            />
            {formErrors.quantity && (
              <p className="text-red-400 text-sm mt-1">{formErrors.quantity}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400">Valor Total</label>
            <input
              type="text"
              name="value"
              readOnly
              value={formatMoney(value || 0)}
              className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white cursor-not-allowed"
            />
            {formErrors.value && (
              <p className="text-red-400 text-sm mt-1">{formErrors.value}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-[#22c55e] hover:bg-[#22c55e]/90 text-white px-4 py-2 rounded-lg ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Processando..." : "Cadastrar Transação"}
          </button>
        </form>
      </Modal>
    </Layout>
  )
}