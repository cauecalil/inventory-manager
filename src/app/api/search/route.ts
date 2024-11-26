import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const limit = parseInt(searchParams.get('limit') || '10')

    const [produtos, categorias, fornecedores] = await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        },
        include: {
          category: true
        },
        take: limit,
        orderBy: {
          name: 'asc'
        }
      }),
      prisma.category.findMany({
        where: {
          name: { contains: query, mode: 'insensitive' }
        },
        take: limit,
        orderBy: {
          name: 'asc'
        }
      }),
      prisma.supplier.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } }
          ]
        },
        take: limit,
        orderBy: {
          name: 'asc'
        }
      })
    ])

    const results = [
      ...produtos.map(p => ({
        id: p.id,
        tipo: 'produto' as const,
        titulo: p.name,
        subtitulo: p.category.name,
        link: `/products?id=${p.id}`
      })),
      
      ...categorias.map(c => ({
        id: c.id,
        tipo: 'categoria' as const,
        titulo: c.name,
        subtitulo: c.description,
        link: `/categories?id=${c.id}`
      })),
      
      ...fornecedores.map(f => ({
        id: f.id,
        tipo: 'fornecedor' as const,
        titulo: f.name,
        subtitulo: f.email,
        link: `/suppliers?id=${f.id}`
      }))
    ]

    return NextResponse.json(results)
  } catch (error) {
    console.error('Erro na pesquisa:', error)
    return NextResponse.json(
      { error: 'Erro ao realizar pesquisa' },
      { status: 500 }
    )
  }
} 