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

  return new PrismaClient({
    log: ["warn", "error"],
    errorFormat: "pretty",
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
}

const prisma = global.prisma || prismaClientSingleton()

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma
  console.log("PrismaClient configurado em ambiente de desenvolvimento")
}

export { prisma }

