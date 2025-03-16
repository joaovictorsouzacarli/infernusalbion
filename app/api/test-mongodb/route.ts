import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    console.log("Testando conexão com MongoDB...")

    // Log the connection string with hidden credentials for debugging
    const connectionString = process.env.DATABASE_URL || ""
    console.log("String de conexão:", connectionString.replace(/:([^:@]+)@/, ":***@"))

    // Test the connection
    await prisma.$connect()
    console.log("Conexão com MongoDB estabelecida com sucesso!")

    // Try to query the database
    const playerCount = await prisma.player.count()
    console.log(`Total de jogadores no banco: ${playerCount}`)

    // Tentar buscar um jogador para verificar se há problemas com os dados
    if (playerCount > 0) {
      try {
        const firstPlayer = await prisma.player.findFirst()
        console.log("Primeiro jogador encontrado:", JSON.stringify(firstPlayer, null, 2))
      } catch (playerError) {
        console.error("Erro ao buscar o primeiro jogador:", playerError)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Conexão com MongoDB estabelecida com sucesso!",
      playerCount,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro detalhado ao conectar com MongoDB:", error)

    // Format the error message for better debugging
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    const isAuthError = errorMessage.includes("AuthenticationFailed") || errorMessage.includes("SCRAM")
    const isConnectionError = errorMessage.includes("connect") || errorMessage.includes("ECONNREFUSED")

    return NextResponse.json(
      {
        success: false,
        error: isAuthError
          ? "Falha na autenticação com o MongoDB. Verifique suas credenciais."
          : isConnectionError
            ? "Falha na conexão com o MongoDB. Verifique se o servidor está acessível."
            : "Erro ao conectar com MongoDB",
        details: errorMessage,
        stack: errorStack,
        timestamp: new Date().toISOString(),
      },
      { status: isAuthError ? 401 : isConnectionError ? 503 : 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}

