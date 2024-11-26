import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

interface StockValue {
  total_value: Prisma.Decimal
}

interface SalesByMonth {
  month: Date
  total: Prisma.Decimal
}

interface SalesByCategory {
  category: string
  total: Prisma.Decimal
}

interface BestSellingProduct {
  name: string
  category: string
  quantity: number
  total_value: Prisma.Decimal
}

interface LowStockProduct {
  id: number
  name: string
  imageUrl: string | null
  sellPrice: Prisma.Decimal
  stock: number
}

interface GrossProfit {
  profit: Prisma.Decimal
}

export async function GET() {
  try {
    // Get total products
    const totalProducts = await prisma.product.count()

    // Calculate total stock value
    const stockValue = await prisma.$queryRaw<StockValue[]>`
      SELECT COALESCE(
        SUM(
          p."buyPrice" * stock_quantity
        ),
        0
      ) as total_value
      FROM (
        SELECT 
          p.id,
          p."buyPrice",
          COALESCE(
            SUM(CASE WHEN t.type = 'IN' THEN t.quantity ELSE -t.quantity END),
            0
          ) as stock_quantity
        FROM products p
        LEFT JOIN transactions t ON p.id = t."productId"
        GROUP BY p.id, p."buyPrice"
      ) p
    `
    
    // Get current month sales
    const firstDayOfMonth = new Date()
    firstDayOfMonth.setDate(1)
    firstDayOfMonth.setHours(0, 0, 0, 0)
    
    const monthSales = await prisma.transaction.aggregate({
      where: {
        type: 'OUT',
        date: {
          gte: firstDayOfMonth
        }
      },
      _sum: {
        totalValue: true
      }
    })

    // Total suppliers
    const totalSuppliers = await prisma.supplier.count()

    // Calculate gross profit (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    // Sales chart for last 6 months
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
    sixMonthsAgo.setDate(1)
    sixMonthsAgo.setHours(0, 0, 0, 0)
    
    const salesByMonth = await prisma.$queryRaw<SalesByMonth[]>`
      WITH RECURSIVE months AS (
        SELECT DATE_TRUNC('month', ${sixMonthsAgo}::timestamp) as month
        UNION ALL
        SELECT DATE_TRUNC('month', month + INTERVAL '1 month')
        FROM months
        WHERE month < DATE_TRUNC('month', CURRENT_DATE)
      )
      SELECT 
        m.month::date as month,
        COALESCE(SUM(t."totalValue"), 0) as total
      FROM months m
      LEFT JOIN transactions t ON 
        DATE_TRUNC('month', t.date) = m.month 
        AND t.type = 'OUT'
      GROUP BY m.month
      ORDER BY m.month ASC
      LIMIT 6
    `

    // Sales by category
    const salesByCategory = await prisma.$queryRaw<SalesByCategory[]>`
      SELECT c.name as category, SUM(t."totalValue") as total
      FROM transactions t
      JOIN products p ON t."productId" = p.id
      JOIN categories c ON p."categoryId" = c.id
      WHERE t.type = 'OUT'
      GROUP BY c.name
      ORDER BY total DESC
      LIMIT 4
    `

    // Best selling products
    const bestSellingProducts = await prisma.$queryRaw<BestSellingProduct[]>`
      SELECT 
        p.name,
        c.name as category,
        SUM(t.quantity) as quantity,
        SUM(t."totalValue") as total_value
      FROM transactions t
      JOIN products p ON t."productId" = p.id
      JOIN categories c ON p."categoryId" = c.id
      WHERE t.type = 'OUT'
      GROUP BY p.name, c.name
      ORDER BY quantity DESC
      LIMIT 5
    `

    // Low stock products
    const lowStockProducts = await prisma.$queryRaw<LowStockProduct[]>`
      SELECT 
        p.id,
        p.name,
        p."imageUrl",
        p."sellPrice",
        COALESCE(
          SUM(CASE WHEN t.type = 'IN' THEN t.quantity ELSE -t.quantity END),
          0
        ) as stock
      FROM products p
      LEFT JOIN transactions t ON t."productId" = p.id
      GROUP BY p.id, p.name, p."imageUrl", p."sellPrice"
      HAVING COALESCE(
        SUM(CASE WHEN t.type = 'IN' THEN t.quantity ELSE -t.quantity END),
        0
      ) < 10
      LIMIT 4
    `

    // Recent transactions
    const recentTransactions = await prisma.transaction.findMany({
      select: {
        id: true,
        type: true,
        quantity: true,
        totalValue: true,
        date: true,
        product: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      },
      take: 10
    })

    const grossProfit = await prisma.$queryRaw<GrossProfit[]>`
      SELECT 
        SUM(t."totalValue" - (t.quantity * p."buyPrice")) as profit
      FROM transactions t
      JOIN products p ON t."productId" = p.id
      WHERE t.type = 'OUT' AND t.date >= ${thirtyDaysAgo}
    `

    const formatNumber = (value: number | bigint | Prisma.Decimal | null | undefined) => {
      if (value === null || value === undefined) return 0;
      if (typeof value === 'bigint') return Number(value);
      if (value instanceof Prisma.Decimal) return Number(value.toFixed(2));
      return value;
    };

    return NextResponse.json({
      totalProducts: formatNumber(totalProducts),
      totalStockValue: formatNumber(stockValue[0]?.total_value),
      salesSummary: {
        monthSales: formatNumber(monthSales._sum.totalValue)
      },
      suppliersSummary: {
        total: formatNumber(totalSuppliers)
      },
      grossProfit: formatNumber(grossProfit[0]?.profit),
      salesChart: salesByMonth.map(sale => ({
        date: sale.month,
        value: formatNumber(sale.total)
      })),
      salesByCategory: salesByCategory.map(category => ({
        category: category.category,
        total: formatNumber(category.total)
      })),
      bestSellingProducts: bestSellingProducts.map(product => ({
        name: product.name,
        category: product.category,
        quantity: formatNumber(product.quantity),
        total_value: formatNumber(product.total_value)
      })),
      lowStockProducts: lowStockProducts.map(product => ({
        id: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        sellPrice: formatNumber(product.sellPrice),
        stock: formatNumber(product.stock)
      })),
      recentTransactions: recentTransactions.map(t => ({
        id: t.id,
        type: t.type,
        product: t.product.name,
        quantity: formatNumber(t.quantity),
        value: formatNumber(t.totalValue),
        date: t.date
      }))
    })

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error('Prisma Error:', error.code, error.message)
      return NextResponse.json(
        { error: 'Database query error' },
        { status: 400 }
      )
    }
    
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}