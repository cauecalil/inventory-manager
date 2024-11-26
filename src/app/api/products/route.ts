import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { calculateProductStock } from '@/lib/utils/stock'

const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  imageUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  buyPrice: z.number().min(0, 'Preço de compra deve ser maior que zero'),
  sellPrice: z.number().min(0, 'Preço de venda deve ser maior que zero'),
  categoryId: z.number().min(1, 'Categoria é obrigatória'),
  supplierId: z.number().min(1, 'Fornecedor é obrigatório')
}).refine(data => data.sellPrice > data.buyPrice, {
  message: "Preço de venda deve ser maior que o preço de compra",
  path: ["sellPrice"]
})

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        supplier: true
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    const productsWithStock = await Promise.all(
      products.map(async (product) => {
        const quantity = await calculateProductStock(product.id)
        return {
          ...product,
          quantity
        }
      })
    )
    
    return NextResponse.json(productsWithStock)
  } catch (error) {
    console.error('Erro ao buscar produtos:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar produtos no banco de dados' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const data = {
      ...body,
      buyPrice: Number(body.buyPrice),
      sellPrice: Number(body.sellPrice),
      categoryId: Number(body.categoryId),
      supplierId: Number(body.supplierId)
    }
    
    const validatedData = productSchema.parse(data)
    
    const product = await prisma.product.create({
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
    
    console.error('Erro ao criar produto:', error)
    return NextResponse.json(
      { error: 'Erro ao criar produto no banco de dados' },
      { status: 500 }
    )
  }
} 