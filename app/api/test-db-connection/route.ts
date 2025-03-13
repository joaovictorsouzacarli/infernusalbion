import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log("Testando conexão com MongoDB...")

    // Testar a conexão
    await prisma.$connect()
    console.log("Conexão com MongoDB estabelecida com sucesso!")

    // Contar jogadores
    const playerCount = await prisma.player.count()
    console.log(`Número de jogadores no banco: ${playerCount}`)

    return NextResponse.json({
      success: true,
      message: "Conexão com MongoDB estabelecida com sucesso!",
      playerCount,
    })
  } catch (error) {
    console.error("Erro ao conectar com MongoDB:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}

