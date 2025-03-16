import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Testar conexão
    await prisma.$connect()

    // Contar jogadores para verificar se a conexão está funcionando
    const playerCount = await prisma.player.count()

    return NextResponse.json({
      success: true,
      message: "Conexão com o banco de dados estabelecida com sucesso",
      playerCount,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao testar conexão:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Falha ao conectar com o banco de dados",
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}

