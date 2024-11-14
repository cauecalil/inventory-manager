import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  // @ts-expect-error: global prisma is not typed
  if (!global.prisma) {
    // @ts-expect-error: global prisma is not typed
    global.prisma = new PrismaClient()
  }
  // @ts-expect-error: global prisma is not typed
  prisma = global.prisma
}

export { prisma }