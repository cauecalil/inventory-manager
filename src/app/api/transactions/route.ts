import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { hasEnoughStock } from '@/lib/utils/stock'

const transactionSchema = z.object({
  type: z.enum(['IN', 'OUT']),
  quantity: z.number().min(1, 'Quantidade deve ser maior que zero'),
  productId: z.number().min(1, 'Produto é obrigatório'),
  unitPrice: z.number().min(0, 'Valor unitário deve ser maior ou igual a zero'),
  totalValue: z.number().min(0, 'Valor total deve ser maior ou igual a zero'),
  date: z.date().default(() => new Date()).refine(
    (date) => date <= new Date(),
    'Data não pode ser futura'
  )
})

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        product: {
          include: {
            category: true,
            supplier: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    })
    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Erro ao buscar transações:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar transações' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = transactionSchema.parse({
      ...body,
      date: new Date(body.date)
    })
    
    const product = await prisma.product.findUnique({
      where: { id: validatedData.productId }
    })
    
    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    if (validatedData.type === 'OUT') {
      const hasStock = await hasEnoughStock(
        validatedData.productId,
        validatedData.quantity
      )
      
      if (!hasStock) {
        return NextResponse.json(
          { error: 'Quantidade maior que o estoque disponível' },
          { status: 400 }
        )
      }
    }

    const transaction = await prisma.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: validatedData,
        include: {
          product: {
            include: {
              category: true,
              supplier: true
            }
          }
        }
      })

      return newTransaction
    })

    return NextResponse.json(transaction)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }
    
    console.error('Erro ao criar transação:', error)
    return NextResponse.json(
      { error: 'Erro ao criar transação' },
      { status: 500 }
    )
  }
} 