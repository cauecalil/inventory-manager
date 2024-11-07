'use client'

import Link from 'next/link'
import Layout from '../components/Layout'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { 
  faBox, 
  faMoneyBill, 
  faChartBar, 
  faTrophy, 
  faBuilding, 
  faSync,
  faArrowUp,
  faArrowDown
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const salesData = [
  { month: 'Jan', vendas: 45000, compras: 55000 },
  { month: 'Fev', vendas: 42000, compras: 52000 },
  { month: 'Mar', vendas: 48000, compras: 43000 },
  { month: 'Abr', vendas: 44000, compras: 35000 },
  { month: 'Mai', vendas: 42000, compras: 30000 },
  { month: 'Jun', vendas: 40000, compras: 45000 },
  { month: 'Jul', vendas: 44000, compras: 42000 },
  { month: 'Ago', vendas: 42000, compras: 40000 },
  { month: 'Set', vendas: 40000, compras: 38000 },
  { month: 'Out', vendas: 42000, compras: 35000 },
]

export default function Dashboard() {
  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Resumo do Inventário */}
        <div className="bg-[#1E2023] rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Resumo do Inventário</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#1A1C1E] rounded-lg">
              <FontAwesomeIcon icon={faBox} className="text-blue-400" />
              <div className="text-sm text-gray-400">Total de Produtos</div>
              <div className="text-xl font-semibold">832</div>
            </div>
            <div className="p-4 bg-[#1A1C1E] rounded-lg">
              <FontAwesomeIcon icon={faMoneyBill} className="text-green-400" />
              <div className="text-sm text-gray-400">Valor Total em Estoque</div>
              <div className="text-xl font-semibold">R$ 18.300</div>
            </div>
          </div>
        </div>

        {/* Resumo de Vendas */}
        <div className="bg-[#1E2023] rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Resumo de Vendas</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#1A1C1E] rounded-lg">
              <FontAwesomeIcon icon={faChartBar} className="text-purple-400" />
              <div className="text-sm text-gray-400">Vendas do Mês</div>
              <div className="text-xl font-semibold">R$ 42.500</div>
            </div>
            <div className="p-4 bg-[#1A1C1E] rounded-lg">
              <FontAwesomeIcon icon={faTrophy} className="text-yellow-400" />
              <div className="text-sm text-gray-400">Produto Mais Vendido</div>
              <div className="text-xl font-semibold">Produto A</div>
            </div>
          </div>
        </div>

        {/* Resumo de Fornecedores */}
        <div className="bg-[#1E2023] rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Resumo de Fornecedores</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-[#1A1C1E] rounded-lg">
              <FontAwesomeIcon icon={faBuilding} className="text-blue-400" />
              <div className="text-sm text-gray-400">Total de Fornecedores</div>
              <div className="text-xl font-semibold">31</div>
            </div>
            <div className="p-4 bg-[#1A1C1E] rounded-lg">
              <FontAwesomeIcon icon={faSync} className="text-orange-400" />
              <div className="text-sm text-gray-400">Pedidos Pendentes</div>
              <div className="text-xl font-semibold">3</div>
            </div>
          </div>
        </div>

        {/* Gráfico de Vendas e Compras */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-[#1E2023] rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Vendas e Compras</h2>
            <button className="px-4 py-1 bg-[#1A1C1E] rounded-lg text-sm">Mensal</button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2D31" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{ background: '#1A1C1E', border: 'none' }}
                  itemStyle={{ color: '#E5E7EB' }}
                />
                <Bar dataKey="vendas" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="compras" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Produtos com Baixo Estoque */}
        <div className="col-span-1 md:col-span-2 bg-[#1E2023] rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Produtos com Baixo Estoque</h2>
            <Link href="/products" className="text-sm text-[#22c55e]">Ver Tudo</Link>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 text-sm">
                <th className="text-left font-medium py-2">Nome</th>
                <th className="text-left font-medium py-2">Categoria</th>
                <th className="text-left font-medium py-2">Quantidade</th>
                <th className="text-left font-medium py-2">Preço</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2">Produto A</td>
                <td className="py-2">Categoria 1</td>
                <td className="py-2">5</td>
                <td className="py-2">R$ 50,00</td>
              </tr>
              <tr>
                <td className="py-2">Produto B</td>
                <td className="py-2">Categoria 2</td>
                <td className="py-2">3</td>
                <td className="py-2">R$ 75,00</td>
              </tr>
              <tr>
                <td className="py-2">Produto C</td>
                <td className="py-2">Categoria 1</td>
                <td className="py-2">7</td>
                <td className="py-2">R$ 30,00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Últimas Transações */}
        <div className="bg-[#1E2023] rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Últimas Transações</h2>
            <Link href="/transactions" className="text-sm text-[#22c55e]">Ver Tudo</Link>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Produto A', type: 'entrada', quantity: 100, date: '2023-05-15' },
              { name: 'Produto B', type: 'saída', quantity: 50, date: '2023-05-14' },
              { name: 'Produto C', type: 'entrada', quantity: 75, date: '2023-05-13' },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between bg-[#1A1C1E] p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon 
                    icon={item.type === 'entrada' ? faArrowUp : faArrowDown} 
                    className={item.type === 'entrada' ? 'text-green-400' : 'text-red-400'} 
                  />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-400">{item.date}</div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded text-sm ${item.type === 'entrada' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {item.type === 'entrada' ? '+' : '-'}{item.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}