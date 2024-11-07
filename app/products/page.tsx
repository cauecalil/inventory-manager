'use client'

import { useState } from 'react'
import Layout from '../components/Layout'
import Table from '../components/Table'
import Modal from '../components/Modal'
import { Plus } from 'lucide-react'

const columns = [
  { key: 'nome', label: 'Nome' },
  { key: 'categoria', label: 'Categoria' },
  { key: 'preco', label: 'Preço' },
  { key: 'quantidade', label: 'Quantidade' },
]

const initialData = [
  { id: 1, nome: 'Produto 1', categoria: 'Categoria 1', preco: 'R$ 10,00', quantidade: 100 },
  { id: 2, nome: 'Produto 2', categoria: 'Categoria 2', preco: 'R$ 20,00', quantidade: 50 },
  { id: 3, nome: 'Produto 3', categoria: 'Categoria 1', preco: 'R$ 30,00', quantidade: 75 },
]

export default function Produtos() {
  const [data, setData] = useState(initialData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)

  const handleEdit = (item) => {
    setCurrentItem(item)
    setIsModalOpen(true)
  }

  const handleDelete = (item) => {
    setData(data.filter((i) => i.id !== item.id))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Lógica para adicionar ou editar item
    setIsModalOpen(false)
  }

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Produtos</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#22c55e] hover:bg-[#22c55e]/90 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Adicionar Produto
        </button>
      </div>

      <Table columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentItem ? 'Editar Produto' : 'Adicionar Produto'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-400">Nome</label>
            <input type="text" id="nome" name="nome" className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white" />
          </div>
          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-400">Categoria</label>
            <input type="text" id="categoria" name="categoria" className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white" />
          </div>
          <div>
            <label htmlFor="preco" className="block text-sm font-medium text-gray-400">Preço</label>
            <input type="text" id="preco" name="preco" className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white" />
          </div>
          <div>
            <label htmlFor="quantidade" className="block text-sm font-medium text-gray-400">Quantidade</label>
            <input type="number" id="quantidade" name="quantidade" className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white" />
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