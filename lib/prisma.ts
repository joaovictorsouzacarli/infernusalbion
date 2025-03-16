import { PrismaClient } from "@prisma/client"

// Declaração para o tipo global
declare global {
  var prisma: PrismaClient | undefined
}

// Criar uma instância do PrismaClient
let prisma: PrismaClient | undefined

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export { prisma }

