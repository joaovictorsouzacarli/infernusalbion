import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log("Iniciando correção do banco de dados...")

    const results = {
      playersFixed: 0,
      recordsFixed: 0,
      errors: [],
    }

    // Corrigir jogadores
    try {
      // Buscar todos os jogadores
      const allPlayers = await prisma.player.findMany()
      console.log(`Verificando ${allPlayers.length} jogadores...`)

      let playersFixed = 0

      // Corrigir cada jogador com valores inválidos
      for (const player of allPlayers) {
        const needsUpdate =
          isNaN(Number(player.avgDps)) || isNaN(Number(player.maxDps)) || isNaN(Number(player.avgRating))

        if (needsUpdate) {
          await prisma.player.update({
            where: { id: player.id },
            data: {
              avgDps: isNaN(Number(player.avgDps)) ? "0" : player.avgDps,
              maxDps: isNaN(Number(player.maxDps)) ? "0" : player.maxDps,
              avgRating: isNaN(Number(player.avgRating)) ? "0" : player.avgRating,
            },
          })
          playersFixed++
        }
      }

      results.playersFixed = playersFixed
      console.log(`Corrigidos ${playersFixed} jogadores`)
    } catch (playerError) {
      console.error("Erro ao corrigir jogadores:", playerError)
      results.errors.push({
        type: "player",
        message: playerError instanceof Error ? playerError.message : String(playerError),
      })
    }

    // Corrigir registros DPS
    try {
      // Buscar todos os registros
      const allRecords = await prisma.dpsRecord.findMany()
      console.log(`Verificando ${allRecords.length} registros DPS...`)

      let recordsFixed = 0

      // Corrigir cada registro com valores inválidos
      for (const record of allRecords) {
        const needsUpdate = isNaN(Number(record.dps)) || isNaN(Number(record.rating))

        if (needsUpdate) {
          await prisma.dpsRecord.update({
            where: { id: record.id },
            data: {
              dps: isNaN(Number(record.dps)) ? 0 : Number(record.dps),
              rating: isNaN(Number(record.rating)) ? 0 : Number(record.rating),
            },
          })
          recordsFixed++
        }
      }

      results.recordsFixed = recordsFixed
      console.log(`Corrigidos ${recordsFixed} registros DPS`)
    } catch (recordError) {
      console.error("Erro ao corrigir registros:", recordError)
      results.errors.push({
        type: "record",
        message: recordError instanceof Error ? recordError.message : String(recordError),
      })
    }

    // Recalcular médias para todos os jogadores
    try {
      console.log("Recalculando médias para todos os jogadores...")

      // Buscar todos os registros DPS
      const allRecords = await prisma.dpsRecord.findMany()

      // Agrupar registros por jogador e classe
      const recordsByPlayerClass = {}

      for (const record of allRecords) {
        const key = `${record.playerName}-${record.playerClass}`
        if (!recordsByPlayerClass[key]) {
          recordsByPlayerClass[key] = []
        }
        recordsByPlayerClass[key].push(record)
      }

      // Buscar todos os jogadores
      const allPlayers = await prisma.player.findMany()

      // Atualizar cada jogador com médias recalculadas
      for (const player of allPlayers) {
        const key = `${player.name}-${player.class}`
        const records = recordsByPlayerClass[key] || []

        if (records.length > 0) {
          // Calcular médias
          const dpsValues = records.map((r) => Number(r.dps)).filter((v) => !isNaN(v))
          const ratingValues = records.map((r) => Number(r.rating)).filter((v) => !isNaN(v))

          const avgDps =
            dpsValues.length > 0 ? (dpsValues.reduce((sum, v) => sum + v, 0) / dpsValues.length).toFixed(0) : "0"

          const maxDps = dpsValues.length > 0 ? Math.max(...dpsValues).toString() : "0"

          const avgRating =
            ratingValues.length > 0
              ? (ratingValues.reduce((sum, v) => sum + v, 0) / ratingValues.length).toFixed(1)
              : "0"

          // Atualizar jogador
          await prisma.player.update({
            where: { id: player.id },
            data: {
              avgDps,
              maxDps,
              avgRating,
            },
          })
        }
      }

      console.log("Médias recalculadas com sucesso")
    } catch (recalcError) {
      console.error("Erro ao recalcular médias:", recalcError)
      results.errors.push({
        type: "recalculation",
        message: recalcError instanceof Error ? recalcError.message : String(recalcError),
      })
    }

    return NextResponse.json({
      success: true,
      results,
      message: "Correção do banco de dados concluída",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro durante correção do banco de dados:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro durante correção do banco de dados",
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}

