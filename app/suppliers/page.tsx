'use client'

import { useState } from 'react'
import Layout from '../components/Layout'
import Table from '../components/Table'
import Modal from '../components/Modal'
import { Plus } from 'lucide-react'

interface Fornecedor {
  id: number;
  nome: string;
  contato: string;
  telefone: string;
  email: string;
}

const columns = [
  { key: 'nome', label: 'Nome' },
  { key: 'contato', label: 'Contato' },
  { key: 'telefone', label: 'Telefone' },
  { key: 'email', label: 'E-mail' },
]

const initialData = [
  { id: 1, nome: 'Fornecedor 1', contato: 'João Silva', telefone: '(11) 1234-5678', email: 'joao@fornecedor1.com' },
  { id: 2, nome: 'Fornecedor 2', contato: 'Maria Santos', telefone: '(11) 2345-6789', email: 'maria@fornecedor2.com' },
  { id: 3, nome: 'Fornecedor 3', contato: 'Pedro Oliveira', telefone: '(11) 3456-7890', email: 'pedro@fornecedor3.com' },
]

export default function Fornecedores() {
  const [data, setData] = useState(initialData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<Fornecedor | null>(null)

  const handleEdit = (item: Fornecedor) => {
    setCurrentItem(item)
    setIsModalOpen(true)
  }

  const handleDelete = (item: Fornecedor) => {
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
        <h1 className="text-2xl font-semibold">Fornecedores</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#22c55e] hover:bg-[#22c55e]/90 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus size={20} className="mr-2" />
          Adicionar Fornecedor
        </button>
      </div>

      <Table columns={columns} data={data} onEdit={handleEdit} onDelete={handleDelete} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={currentItem ? 'Editar Fornecedor' : 'Adicionar Fornecedor'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-gray-400">Nome</label>
            <input type="text" id="nome" name="nome" className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white" />
          </div>
          <div>
            <label htmlFor="contato" className="block text-sm font-medium text-gray-400">Contato</label>
            <input type="text" id="contato" name="contato" className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white" />
          </div>
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-400">Telefone</label>
            <input type="tel" id="telefone" name="telefone" className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-400">E-mail</label>
            <input type="email" id="email" name="email" className="mt-1 block w-full rounded-md bg-[#1A1C1E] border-gray-700 text-white" />
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