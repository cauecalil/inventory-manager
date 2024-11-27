import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Verifica se é uma chamada à API
    if (req.nextUrl.pathname.startsWith('/api')) {
      if (!req.nextauth.token) {
        return new NextResponse(
          JSON.stringify({ error: 'Não autorizado' }),
          { 
            status: 401,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      }
    }
    return NextResponse.next()
  },
  {
    pages: {
      signIn: '/login'
    }
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/products/:path*',
    '/categories/:path*',
    '/suppliers/:path*',
    '/transactions/:path*',
    '/api/products/:path*',
    '/api/categories/:path*',
    '/api/suppliers/:path*',
    '/api/transactions/:path*',
    '/api/search/:path*',
    '/api/dashboard/:path*'
  ]
} 