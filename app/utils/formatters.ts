import { Prisma } from '@prisma/client'

export const formatMoney = (value: number | string | Prisma.Decimal | null): string => {
  if (!value) return 'R$ 0,00'
  
  if (typeof value === 'object' && value !== null) {
    return value.toNumber().toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(numValue)) return 'R$ 0,00'
  
  return numValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  })
}