'use client'

import Layout from '../components/Layout'
import { useApi } from '../hooks/useApi'
import { formatMoney } from '../utils/formatters'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LabelList
} from 'recharts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faBox, 
  faDollarSign, 
  faChartLine, 
  faExclamationTriangle,
  faList
} from '@fortawesome/free-solid-svg-icons'
import ErrorDisplay from '../components/ErrorDisplay'
import Image from 'next/image'

const COLORS = ['#22c55e', '#3b82f6', '#ef4444', '#f59e0b']

interface DashboardData {
  totalProducts: number;
  totalStockValue: number;
  salesSummary: { 
    monthSales: number 
  };
  suppliersSummary: { 
    total: number 
  };
  grossProfit: number;
  salesChart: Array<{
    date: string;
    value: number;
  }>;
  salesByCategory: Array<{
    category: string;
    total: number;
  }>;
  bestSellingProducts: Array<{
    name: string;
    category: string;
    quantity: number;
    total_value: number;
  }>;
  lowStockProducts: Array<{
    id: number;
    name: string;
    imageUrl: string | null;
    sellPrice: number;
    stock: number;
  }>;
  recentTransactions: Array<{
    id: number;
    type: 'IN' | 'OUT';
    product: string;
    quantity: number;
    value: number;
    date: string;
  }>;
}

export default function Dashboard() {
  const { data, loading, error, refetch } = useApi<DashboardData>('/api/dashboard')

  if (error) {
    return (
      <Layout>
        <ErrorDisplay 
          title="Erro ao carregar painel"
          message={error}
          onRetry={refetch}
        />
      </Layout>
    )
  }

  return (
    <Layout loading={loading}>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Painel de Controle</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[#1E2023] rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm">Total de Produtos</h3>
            <FontAwesomeIcon icon={faBox} className="text-gray-400 h-5 w-5" />
          </div>
          <div className="text-2xl font-semibold text-white">{data?.totalProducts || 0}</div>
          <div className="text-sm text-gray-400 mt-1">
            {data?.lowStockProducts?.length || 0} produtos com estoque baixo
          </div>
        </div>
        
        <div className="bg-[#1E2023] rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm">Valor em Estoque</h3>
            <FontAwesomeIcon icon={faDollarSign} className="text-[#22c55e] h-5 w-5" />
          </div>
          <div className="text-2xl font-semibold text-[#22c55e]">
            {formatMoney(data?.totalStockValue || 0)}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            {data?.suppliersSummary?.total || 0} fornecedores ativos
          </div>
        </div>

        <div className="bg-[#1E2023] rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm">Vendas do Mês</h3>
            <FontAwesomeIcon icon={faChartLine} className="text-[#3b82f6] h-5 w-5" />
          </div>
          <div className="text-2xl font-semibold text-[#3b82f6]">
            {formatMoney(data?.salesSummary?.monthSales || 0)}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            Média diária: {formatMoney((data?.salesSummary?.monthSales || 0) / new Date().getDate())}
          </div>
        </div>

        <div className="bg-[#1E2023] rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm">Lucro Bruto</h3>
            <FontAwesomeIcon icon={faDollarSign} className="text-[#22c55e] h-5 w-5" />
          </div>
          <div className="text-2xl font-semibold text-[#22c55e]">
            {formatMoney(data?.grossProfit || 0)}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            Últimos 30 dias
          </div>
        </div>

        <div className="bg-[#1E2023] rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm">Produtos Mais Vendidos</h3>
            <FontAwesomeIcon icon={faBox} className="text-[#f59e0b] h-5 w-5" />
          </div>
          <div className="text-2xl font-semibold text-[#f59e0b]">
            {data?.bestSellingProducts?.[0]?.name || 'Nenhum'}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            {data?.bestSellingProducts?.[0]?.quantity || 0} unidades vendidas
          </div>
        </div>

        <div className="bg-[#1E2023] rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm">Categoria Mais Vendida</h3>
            <FontAwesomeIcon icon={faList} className="text-[#8b5cf6] h-5 w-5" />
          </div>
          <div className="text-2xl font-semibold text-[#8b5cf6]">
            {data?.salesByCategory?.[0]?.category || 'Nenhuma'}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            {formatMoney(data?.salesByCategory?.[0]?.total || 0)} em vendas
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1E2023] rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-lg font-semibold mb-4 text-white">Histórico de Vendas</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={data?.salesChart}
                margin={{ 
                  top: 20, 
                  right: 20, 
                  left: 20, 
                  bottom: 20 
                }}
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#2A2D31" 
                  vertical={false}
                />
                <XAxis 
                  dataKey="date" 
                  stroke="#6B7280"
                  axisLine={{ stroke: '#2A2D31' }}
                  tickLine={{ stroke: '#2A2D31' }}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString('pt-BR', { 
                      month: 'short',
                      year: date.getFullYear() !== new Date().getFullYear() ? '2-digit' : undefined 
                    }).replace('.', '')
                  }}
                />
                <YAxis 
                  stroke="#6B7280"
                  axisLine={{ stroke: '#2A2D31' }}
                  tickLine={{ stroke: '#2A2D31' }}
                  tickFormatter={(value) => {
                    if (value >= 1000) {
                      return `R$ ${(value / 1000).toFixed(1)}k`
                    }
                    return `R$ ${value}`
                  }}
                  width={80}
                />
                <Tooltip
                  cursor={{ fill: '#2A2D31', opacity: 0.1 }}
                  contentStyle={{ 
                    background: '#1A1C1E', 
                    border: '1px solid rgba(75, 85, 99, 0.3)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: '#E5E7EB' }}
                  labelStyle={{ color: '#9CA3AF' }}
                  formatter={(value: number) => `${formatMoney(value)}`}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('pt-BR', { 
                    month: 'long',
                    year: 'numeric'
                  })}
                />
                <Bar 
                  dataKey="value" 
                  name="Vendas" 
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={50}
                >
                  <LabelList 
                    dataKey="value" 
                    position="top" 
                    fill="#6B7280"
                    formatter={(value: number) => formatMoney(value)}
                    style={{ fontSize: '12px' }}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#1E2023] rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-lg font-semibold mb-4 text-white">Vendas por Categoria</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.salesByCategory}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ category, percent }) => 
                    `${category} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {data?.salesByCategory?.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1A1C1E', border: '1px solid rgba(75, 85, 99, 0.3)' }}
                  itemStyle={{ color: '#E5E7EB' }}
                  formatter={(value: number) => `${formatMoney(value)}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1E2023] rounded-xl p-6 border border-gray-700/50">
          <h2 className="text-lg font-semibold mb-4 text-white">Produtos Mais Vendidos</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Produto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Categoria</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Qtd. Vendida</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Valor Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {data?.bestSellingProducts?.map((produto, index) => (
                  <tr key={index} className="hover:bg-gray-800/30">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{produto.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{produto.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{produto.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#22c55e]">
                      {formatMoney(produto.total_value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#1E2023] rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-400 text-sm">Produtos com Baixo Estoque</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded-full">
                {data?.lowStockProducts?.length || 0} itens
              </span>
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-400 h-5 w-5" />
            </div>
          </div>
          
          {data?.lowStockProducts?.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              Nenhum produto com estoque baixo
            </div>
          ) : (
            <div className="space-y-4">
              {data?.lowStockProducts?.map((produto) => (
                <div key={produto.id} className="bg-[#1A1C1E] rounded-lg p-4 border border-gray-700/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 relative flex-shrink-0">
                      <Image
                        src={produto.imageUrl || '/placeholder-product.png'}
                        alt={produto.name}
                        className="object-cover rounded-lg"
                        fill
                        sizes="48px"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-product.png'
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-white truncate">{produto.name}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <div className="text-sm text-gray-400">
                          Estoque: <span className="text-red-400 font-medium">{produto.stock}</span>
                        </div>
                        <div className="text-sm text-[#22c55e]">
                          {formatMoney(produto.sellPrice)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-[#1E2023] rounded-xl p-6 border border-gray-700/50">
        <h2 className="text-lg font-semibold mb-4 text-white">Últimas Transações</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Produto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Quantidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {data?.recentTransactions?.map((transacao) => (
                <tr key={transacao.id} className="hover:bg-gray-800/30">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {new Date(transacao.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transacao.type === 'IN' 
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-red-900/30 text-red-400'
                    }`}>
                      {transacao.type === 'IN' ? 'Entrada' : 'Saída'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transacao.product}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{transacao.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {formatMoney(transacao.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}