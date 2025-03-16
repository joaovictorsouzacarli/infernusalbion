import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log("Iniciando diagnóstico do banco de dados...")

    // Verificar conexão
    await prisma.$connect()
    console.log("Conexão com MongoDB estabelecida com sucesso")

    // Estrutura para armazenar resultados do diagnóstico
    const diagnosticResults = {
      connection: true,
      playerCount: 0,
      recordCount: 0,
      playerSample: null,
      recordSample: null,
      invalidPlayers: [],
      invalidRecords: [],
      errors: [],
    }

    // Verificar contagem de jogadores
    try {
      const playerCount = await prisma.player.count()
      diagnosticResults.playerCount = playerCount
      console.log(`Total de jogadores: ${playerCount}`)

      // Obter amostra de jogador
      if (playerCount > 0) {
        const playerSample = await prisma.player.findFirst()
        diagnosticResults.playerSample = playerSample
        console.log("Amostra de jogador:", playerSample)

        // Verificar jogadores com valores inválidos
        const allPlayers = await prisma.player.findMany()
        const invalidPlayers = allPlayers.filter((player) => {
          return isNaN(Number(player.avgDps)) || isNaN(Number(player.maxDps)) || isNaN(Number(player.avgRating))
        })

        diagnosticResults.invalidPlayers = invalidPlayers.map((p) => ({
          id: p.id,
          name: p.name,
          avgDps: p.avgDps,
          maxDps: p.maxDps,
          avgRating: p.avgRating,
        }))

        if (invalidPlayers.length > 0) {
          console.log(`Encontrados ${invalidPlayers.length} jogadores com valores inválidos`)
        }
      }
    } catch (playerError) {
      console.error("Erro ao verificar jogadores:", playerError)
      diagnosticResults.errors.push({
        type: "player",
        message: playerError instanceof Error ? playerError.message : String(playerError),
      })
    }

    // Verificar contagem de registros
    try {
      const recordCount = await prisma.dpsRecord.count()
      diagnosticResults.recordCount = recordCount
      console.log(`Total de registros DPS: ${recordCount}`)

      // Obter amostra de registro
      if (recordCount > 0) {
        const recordSample = await prisma.dpsRecord.findFirst()
        diagnosticResults.recordSample = recordSample
        console.log("Amostra de registro:", recordSample)

        // Verificar registros com valores inválidos
        const allRecords = await prisma.dpsRecord.findMany()
        const invalidRecords = allRecords.filter((record) => {
          return isNaN(Number(record.dps)) || isNaN(Number(record.rating))
        })

        diagnosticResults.invalidRecords = invalidRecords.map((r) => ({
          id: r.id,
          playerName: r.playerName,
          dps: r.dps,
          rating: r.rating,
        }))

        if (invalidRecords.length > 0) {
          console.log(`Encontrados ${invalidRecords.length} registros com valores inválidos`)
        }
      }
    } catch (recordError) {
      console.error("Erro ao verificar registros:", recordError)
      diagnosticResults.errors.push({
        type: "record",
        message: recordError instanceof Error ? recordError.message : String(recordError),
      })
    }

    return NextResponse.json({
      success: true,
      diagnosticResults,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro durante diagnóstico:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro durante diagnóstico do banco de dados",
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}

