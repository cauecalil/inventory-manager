'use client'

import { useState } from 'react'
import Layout from '../components/Layout'
import Table from '../components/Table'
import Modal from '../components/Modal'
import { Plus } from 'lucide-react'

const columns = [
  { key: 'nome', label: 'Nome' },
  { key: 'descricao', label: 'Descrição' },
]

const initialData = [
  { id: 1, nome: 'Categoria 1', descricao: 'Descrição da Categoria 1' },
  { id: 2, nome: 'Categoria 2', descricao: 'Descrição da Categoria 2' },
  { id: 3, nome: 'Categoria 3', descricao: 'Descrição da Categoria 3' },
]

export default function Categorias() {
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
        <h1 className="text-2xl font-semibold">Categorias</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#22c55e] hover:bg-[#22c55e]/90 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Adicionar Categoria
        </button>
      </div>

      <Table columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentItem ? 'Editar Categoria' : 'Adicionar Categoria'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-400">Nome</label>
            <input type="text" id="nome" name="nome" className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white" />
          </div>
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-gray-400">Descrição</label>
            <textarea id="descricao" name="descricao" rows={3} className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white"></textarea>
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