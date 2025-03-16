import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { samplePlayers, sampleDpsRecords } from "@/lib/sample-data"

export async function GET(request: Request) {
  try {
    // Extrair parâmetros da URL
    const { searchParams } = new URL(request.url)
    const force = searchParams.get("force") === "true"

    console.log("Conectando ao MongoDB Atlas para inicializar banco de dados...")

    // Verificar se já existem dados
    const playerCount = await prisma.player.count()
    const recordCount = await prisma.dpsRecord.count()

    console.log(`Estado atual: ${playerCount} jogadores, ${recordCount} registros`)

    // Se já existem dados e não foi forçado, não fazer nada
    if ((playerCount > 0 || recordCount > 0) && !force) {
      return NextResponse.json({
        success: true,
        message: "Banco de dados já contém dados. Use ?force=true para reinicializar.",
        playerCount,
        recordCount,
        timestamp: new Date().toISOString(),
      })
    }

    // Limpar coleções existentes
    await prisma.dpsRecord.deleteMany({})
    await prisma.player.deleteMany({})

    console.log("Coleções limpas com sucesso")

    // Inserir jogadores de exemplo
    let playersInserted = 0
    for (const player of samplePlayers) {
      await prisma.player.create({
        data: {
          playerBaseId: player.playerBaseId,
          name: player.name,
          guild: player.guild,
          class: player.class,
          avgDps: player.avgDps,
          maxDps: player.maxDps,
          avgRating: player.avgRating,
          isHealer: player.isHealer,
        },
      })
      playersInserted++
    }

    // Inserir registros de DPS de exemplo
    let recordsInserted = 0
    for (const record of sampleDpsRecords) {
      await prisma.dpsRecord.create({
        data: {
          playerId: record.playerId,
          playerBaseId: record.playerBaseId,
          playerName: record.playerName,
          playerClass: record.playerClass,
          dps: record.dps,
          rating: record.rating,
          date: record.date,
          huntType: record.huntType,
          isHeal: record.isHeal,
        },
      })
      recordsInserted++
    }

    return NextResponse.json({
      success: true,
      message: "Banco de dados inicializado com sucesso",
      playersInserted,
      recordsInserted,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao inicializar banco de dados:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Falha ao inicializar banco de dados",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}

