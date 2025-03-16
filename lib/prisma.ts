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
    const client = new PrismaClient({
      log: ["query", "info", "warn", "error"],
      errorFormat: "pretty",
    })

    // Adicionar listeners para eventos de conexão
    client.$on("query", (e) => {
      console.log("Query: " + e.query)
      console.log("Duration: " + e.duration + "ms")
    })

    client.$on("error", (e) => {
      console.error("Prisma Error:", e)
    })

    return client
  } catch (error) {
    console.error("Erro crítico ao inicializar PrismaClient:", error)
    throw error
  }
}

// Usar o cliente global em desenvolvimento para evitar múltiplas instâncias
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

    // Tentar identificar o tipo de erro
    const errorMessage = String(error)
    if (errorMessage.includes("Authentication failed")) {
      console.error("ERRO DE AUTENTICAÇÃO: Verifique usuário e senha no DATABASE_URL")
    } else if (errorMessage.includes("ENOTFOUND") || errorMessage.includes("ETIMEDOUT")) {
      console.error("ERRO DE CONEXÃO: Não foi possível conectar ao servidor. Verifique o host no DATABASE_URL")
    } else if (errorMessage.includes("Invalid `prisma.connect()`")) {
      console.error("ERRO DE CONFIGURAÇÃO: String de conexão inválida")
    }
  })

export { prisma }

