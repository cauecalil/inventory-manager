'use client'

import { useState } from 'react'
import Layout from '../components/Layout'
import Table from '../components/Table'
import Modal from '../components/Modal'
import { Plus } from 'lucide-react'

interface Transaction {
  id: number
  data: string
  tipo: string
  produto: string
  quantidade: number
  valor: string
}

const columns = [
  { key: 'data', label: 'Data' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'produto', label: 'Produto' },
  { key: 'quantidade', label: 'Quantidade' },
  { key: 'valor', label: 'Valor' },
]

const initialData = [
  { id: 1, data: '2023-05-15', tipo: 'Entrada', produto: 'Produto 1', quantidade: 100, valor: 'R$ 1000,00' },
  { id: 2, data: '2023-05-14', tipo: 'Saída', produto: 'Produto 2', quantidade: 50, valor: 'R$ 500,00' },
  { id: 3, data: '2023-05-13', tipo: 'Entrada', produto: 'Produto 3', quantidade: 75, valor: 'R$ 750,00' },
]

export default function Transacoes() {
  const [data, setData] = useState<Transaction[]>(initialData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<Transaction | null>(null)

  const handleEdit = (item: Transaction) => {
    setCurrentItem(item)
    setIsModalOpen(true)
  }

  const handleDelete = (item: Transaction) => {
    setData(data.filter((i) => i.id !== item.id))
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Lógica para adicionar ou editar item
    setIsModalOpen(false)
  }

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Transações</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#22c55e] hover:bg-[#22c55e]/90 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Adicionar Transação
        </button>
      </div>

      <Table columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentItem ? 'Editar Transação' : 'Adicionar Transação'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="data" className="block text-sm font-medium text-gray-400">Data</label>
            <input type="date" id="data" name="data" className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white" />
          </div>
          <div>
            <label htmlFor="tipo" className="block text-sm font-medium text-gray-400">Tipo</label>
            <select id="tipo" name="tipo" className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white">
              <option value="Entrada">Entrada</option>
              <option value="Saída">Saída</option>
            </select>
          </div>
          <div>
            <label htmlFor="produto" className="block text-sm font-medium text-gray-400">Produto</label>
            <input type="text" id="produto" name="produto" className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white" />
          </div>
          <div>
            <label htmlFor="quantidade" className="block text-sm font-medium text-gray-400">Quantidade</label>
            <input type="number" id="quantidade" name="quantidade" className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white" />
          </div>
          <div>
            <label htmlFor="valor" className="block text-sm font-medium text-gray-400">Valor</label>
            <input type="text" id="valor" name="valor" className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white" />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="bg-[#22c55e] hover:bg-[#22c55e]/90 text-white px-4 py-2 rounded-lg">
              {currentItem ? 'Atualizar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}