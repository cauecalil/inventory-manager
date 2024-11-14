import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { calculateProductStock } from '@/lib/stock'

const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  imageUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  buyPrice: z.number().min(0, 'Preço de compra deve ser maior que zero'),
  sellPrice: z.number().min(0, 'Preço de venda deve ser maior que zero'),
  categoryId: z.number().min(1, 'Categoria é obrigatória'),
  supplierId: z.number().min(1, 'Fornecedor é obrigatório')
})

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = productSchema.parse(body)
    
    const product = await prisma.product.update({
      where: { id: Number(params.id) },
      data: validatedData,
      include: {
        category: true,
        supplier: true
      }
    })
    
    const quantity = await calculateProductStock(product.id)
    
    return NextResponse.json({
      ...product,
      quantity
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'Produto não encontrado' },
          { status: 404 }
        )
      }
    }
    
    console.error('Erro ao atualizar produto:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar produto' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = Number(params.id)
    
    const stock = await calculateProductStock(productId)
    if (stock > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir um produto com estoque disponível' },
        { status: 400 }
      )
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { transactions: true }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Produto não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se existem transações vinculadas
    if (product.transactions.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir um produto que possui transações vinculadas' },
        { status: 400 }
      )
    }

    await prisma.product.delete({
      where: { id: productId }
    })

    return NextResponse.json({ message: 'Produto excluído com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir produto:', error)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Log específico para erros conhecidos do Prisma
      console.error('Código de erro Prisma:', error.code)
    }
    return NextResponse.json(
      { error: 'Erro ao excluir produto' },
      { status: 500 }
    )
  }
}