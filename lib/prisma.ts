import { PrismaClient } from "@prisma/client"

// PrismaClient é anexado ao objeto global em desenvolvimento para evitar
// múltiplas instâncias do Prisma Client em desenvolvimento
declare global {
  var prisma: PrismaClient | undefined
}

// Adicionar logs para depuração
const prismaClientSingleton = () => {
  console.log("Inicializando PrismaClient com URL:", process.env.DATABASE_URL)
  return new PrismaClient({
    log: ["query", "info", "warn", "error"],
  })
}

const client = global.prisma || prismaClientSingleton()

if (process.env.NODE_ENV !== "production") {
  global.prisma = client
  console.log("PrismaClient configurado em ambiente de desenvolvimento")
}

export const prisma = client

