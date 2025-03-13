import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
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
    const isAuthError = errorMessage.includes("AuthenticationFailed") || errorMessage.includes("SCRAM")

    return NextResponse.json(
      {
        success: false,
        error: isAuthError
          ? "Falha na autenticação com o MongoDB. Verifique suas credenciais."
          : "Erro ao conectar com MongoDB",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      },
      { status: isAuthError ? 401 : 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}

