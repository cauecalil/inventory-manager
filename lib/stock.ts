import { prisma } from './prisma'

export async function calculateProductStock(productId: number): Promise<number> {
  const transactions = await prisma.transaction.groupBy({
    by: ['type'],
    where: {
      productId
    },
    _sum: {
      quantity: true
    }
  })

  const inputs = transactions.find(t => t.type === 'IN')?._sum.quantity || 0
  const outputs = transactions.find(t => t.type === 'OUT')?._sum.quantity || 0

  return inputs - outputs
}

export async function hasEnoughStock(productId: number, requestedQuantity: number): Promise<boolean> {
  const currentStock = await calculateProductStock(productId)
  return currentStock >= requestedQuantity
} 