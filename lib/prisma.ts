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
      // Adicionar configurações para melhorar a estabilidade
      // Aumentar timeouts para operações lentas
      __internal: {
        engine: {
          connectionTimeout: 10000, // 10 segundos
          queryEngineTimeout: 15000, // 15 segundos
        },
      },
    })
  } catch (error) {
    console.error("Erro ao inicializar PrismaClient:", error)
    throw error
  }
}

// Usar uma abordagem mais robusta para inicializar o Prisma
let prisma: PrismaClient

// Em produção, sempre criar uma nova instância
if (process.env.NODE_ENV === "production") {
  prisma = prismaClientSingleton()
  console.log("PrismaClient configurado em ambiente de produção")
} else {
  // Em desenvolvimento, reutilizar a instância global
  if (!global.prisma) {
    global.prisma = prismaClientSingleton()
    console.log("PrismaClient configurado em ambiente de desenvolvimento")
  }
  prisma = global.prisma
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

