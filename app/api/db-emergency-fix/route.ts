import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { samplePlayers, sampleDpsRecords } from "@/lib/sample-data"

export async function GET() {
  try {
    console.log("Iniciando procedimento de emergência para o banco de dados...")

    // Etapa 1: Verificar conexão
    console.log("Verificando conexão com o banco de dados...")
    await prisma.$connect()
    console.log("Conexão estabelecida com sucesso")

    // Etapa 2: Verificar estado atual
    const playerCount = await prisma.player.count()
    const recordCount = await prisma.dpsRecord.count()
    console.log(`Estado atual: ${playerCount} jogadores, ${recordCount} registros`)

    // Etapa 3: Limpar dados existentes
    console.log("Limpando dados existentes...")
    await prisma.dpsRecord.deleteMany({})
    await prisma.player.deleteMany({})
    console.log("Dados limpos com sucesso")

    // Etapa 4: Inserir dados de exemplo
    console.log("Inserindo dados de exemplo...")

    // Inserir jogadores de exemplo
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
    }

    // Inserir registros de DPS de exemplo
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
    }

    console.log("Dados de exemplo inseridos com sucesso")

    // Etapa 5: Verificar estado final
    const finalPlayerCount = await prisma.player.count()
    const finalRecordCount = await prisma.dpsRecord.count()

    return NextResponse.json({
      success: true,
      message: "Procedimento de emergência concluído com sucesso",
      details: {
        estadoInicial: { jogadores: playerCount, registros: recordCount },
        estadoFinal: { jogadores: finalPlayerCount, registros: finalRecordCount },
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro durante procedimento de emergência:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro durante procedimento de emergência",
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

