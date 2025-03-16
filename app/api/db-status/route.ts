import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log("Verificando status do banco de dados...")

    // Verificar conexão
    await prisma.$connect()
    console.log("Conexão com MongoDB estabelecida com sucesso")

    // Verificar contagem de jogadores
    const playerCount = await prisma.player.count()
    console.log(`Total de jogadores: ${playerCount}`)

    // Verificar contagem de registros
    const recordCount = await prisma.dpsRecord.count()
    console.log(`Total de registros DPS: ${recordCount}`)

    // Obter amostra de jogador
    let playerSample = null
    if (playerCount > 0) {
      playerSample = await prisma.player.findFirst()
      console.log("Amostra de jogador:", playerSample)
    }

    // Obter amostra de registro
    let recordSample = null
    if (recordCount > 0) {
      recordSample = await prisma.dpsRecord.findFirst()
      console.log("Amostra de registro:", recordSample)
    }

    // Verificar string de conexão (com segurança)
    const connectionString = process.env.DATABASE_URL || ""
    const safeConnectionString = connectionString.replace(/:([^:@]+)@/, ":***@")

    return NextResponse.json({
      success: true,
      status: {
        connection: true,
        playerCount,
        recordCount,
        playerSample,
        recordSample,
        connectionString: safeConnectionString,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao verificar status do banco de dados:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro ao verificar status do banco de dados",
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}

