import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    const [products, categories, suppliers] = await Promise.all([
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
        take: 5,
        orderBy: {
          name: 'asc'
        }
      }),
      prisma.category.findMany({
        where: {
          name: { contains: query, mode: 'insensitive' }
        },
        take: 5,
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
        take: 5,
        orderBy: {
          name: 'asc'
        }
      })
    ])

    const results = [
      ...products.map(p => ({
        id: p.id,
        type: 'product' as const,
        title: p.name,
        subtitle: p.category.name,
        link: `/products?action=edit&id=${p.id}`
      })),
      
      ...categories.map(c => ({
        id: c.id,
        type: 'category' as const,
        title: c.name,
        subtitle: c.description,
        link: `/categories?action=edit&id=${c.id}`
      })),
      
      ...suppliers.map(f => ({
        id: f.id,
        type: 'supplier' as const,
        title: f.name,
        subtitle: f.email,
        link: `/suppliers?action=edit&id=${f.id}`
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