import { PrismaClient } from "@prisma/client"

// PrismaClient é anexado ao objeto global em desenvolvimento para evitar
// múltiplas instâncias do Prisma Client em desenvolvimento
declare global {
  var prisma: PrismaClient | undefined
}

const client = global.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") global.prisma = client

export const prisma = client

