import { PrismaClient } from "@prisma/client"

declare global {
  var prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  console.log("Inicializando PrismaClient...")

  // Log connection info (safely)
  const dbUrl = process.env.DATABASE_URL || ""
  console.log("DATABASE_URL:", dbUrl.replace(/:([^:@]+)@/, ":***@"))
  console.log("NODE_ENV:", process.env.NODE_ENV)

  try {
    // Configuração mais robusta do Prisma
    return new PrismaClient({
      log: ["warn", "error"],
      errorFormat: "pretty",
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    })
  } catch (error) {
    console.error("Erro ao inicializar PrismaClient:", error)
    throw error
  }
}

const prisma = global.prisma || prismaClientSingleton()

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma
  console.log("PrismaClient configurado em ambiente de desenvolvimento")
}

// Adicionar tratamento de erro para conexões
prisma
  .$connect()
  .then(() => {
    console.log("Conexão com o banco de dados estabelecida com sucesso")
  })
  .catch((error) => {
    console.error("Erro ao conectar com o banco de dados:", error)
  })

export { prisma }

