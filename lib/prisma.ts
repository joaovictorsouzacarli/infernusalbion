import { PrismaClient } from "@prisma/client"

// PrismaClient é anexado ao objeto global em desenvolvimento para evitar
// múltiplas instâncias do Prisma Client em desenvolvimento
declare global {
  var prisma: PrismaClient | undefined
}

// Configuração do Prisma Client com logs detalhados
const prismaClientSingleton = () => {
  console.log("Inicializando PrismaClient...")
  console.log("DATABASE_URL:", process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ":***@")) // Oculta a senha
  console.log("NODE_ENV:", process.env.NODE_ENV)

  return new PrismaClient({
    log: ["query", "info", "warn", "error"],
    errorFormat: "pretty",
  })
}

// Usar cliente existente ou criar novo
const client = global.prisma || prismaClientSingleton()

if (process.env.NODE_ENV !== "production") {
  global.prisma = client
  console.log("PrismaClient configurado em ambiente de desenvolvimento")
}

export const prisma = client

