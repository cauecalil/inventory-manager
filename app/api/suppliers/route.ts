import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const supplierSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  contact: z.string().min(1, 'Contato é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().email('Email inválido')
})

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''

    const suppliers = await prisma.supplier.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      },
      include: {
        products: true,
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({
      data: suppliers
    })
  } catch (error) {
    console.error('Erro ao buscar fornecedores:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar fornecedores' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validatedData = supplierSchema.parse(body)
    
    const supplier = await prisma.supplier.create({
      data: validatedData
    })
    
    return NextResponse.json(supplier)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Erro ao criar fornecedor' },
      { status: 500 }
    )
  }
} 