import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { samplePlayers, sampleDpsRecords } from "@/lib/sample-data"

export async function GET(request: Request) {
  try {
    // Extrair o modo da URL
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get("mode") || "diagnose"

    console.log(`Iniciando operação de reparo: ${mode}`)

    // Verificar conexão com o banco
    try {
      await prisma.$disconnect()
      await prisma.$connect()
      console.log("Conexão com o banco estabelecida")
    } catch (connError) {
      console.error("Erro na conexão com o banco:", connError)
      return NextResponse.json(
        {
          success: false,
          error: "Falha na conexão com o banco de dados",
          details: connError instanceof Error ? connError.message : String(connError),
        },
        { status: 500 },
      )
    }

    const result: any = { success: true }

    // Executar a operação solicitada
    switch (mode) {
      case "diagnose":
        // Verificar o estado do banco de dados
        result.playerCount = await prisma.player.count()
        result.recordCount = await prisma.dpsRecord.count()

        // Verificar se há jogadores com valores inválidos
        const allPlayers = await prisma.player.findMany()
        const invalidPlayers = allPlayers.filter((player) => {
          return isNaN(Number(player.avgDps)) || isNaN(Number(player.maxDps)) || isNaN(Number(player.avgRating))
        })

        result.invalidPlayers = invalidPlayers.length

        // Verificar se há registros com valores inválidos
        const allRecords = await prisma.dpsRecord.findMany()
        const invalidRecords = allRecords.filter((record) => {
          return isNaN(Number(record.dps)) || isNaN(Number(record.rating))
        })

        result.invalidRecords = invalidRecords.length
        result.message = "Diagnóstico concluído"

        // Verificar string de conexão (com segurança)
        const connectionString = process.env.DATABASE_URL || ""
        result.connectionString = connectionString.replace(/:([^:@]+)@/, ":***@")
        break

      case "fix":
        // Corrigir jogadores com valores inválidos
        const playersToFix = await prisma.player.findMany()
        let playersFixed = 0

        for (const player of playersToFix) {
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

        // Corrigir registros com valores inválidos
        const recordsToFix = await prisma.dpsRecord.findMany()
        let recordsFixed = 0

        for (const record of recordsToFix) {
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

        result.playersFixed = playersFixed
        result.recordsFixed = recordsFixed
        result.message = "Correção concluída"
        break

      case "reset":
        // Limpar todos os dados existentes
        await prisma.dpsRecord.deleteMany({})
        await prisma.player.deleteMany({})

        // Inserir dados de exemplo
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

        result.message = "Reset completo realizado com sucesso"
        result.playerCount = samplePlayers.length
        result.recordCount = sampleDpsRecords.length
        break

      case "recalculate":
        // Recalcular médias para todos os jogadores
        const players = await prisma.player.findMany()
        const records = await prisma.dpsRecord.findMany()

        // Agrupar registros por jogador e classe
        const recordsByPlayerClass: Record<string, any[]> = {}

        for (const record of records) {
          const key = `${record.playerName}-${record.playerClass}`
          if (!recordsByPlayerClass[key]) {
            recordsByPlayerClass[key] = []
          }
          recordsByPlayerClass[key].push(record)
        }

        // Atualizar cada jogador
        let playersUpdated = 0

        for (const player of players) {
          const key = `${player.name}-${player.class}`
          const playerRecords = recordsByPlayerClass[key] || []

          if (playerRecords.length > 0) {
            // Calcular médias
            const dpsValues = playerRecords.map((r) => Number(r.dps)).filter((v) => !isNaN(v))
            const ratingValues = playerRecords.map((r) => Number(r.rating)).filter((v) => !isNaN(v))

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

            playersUpdated++
          }
        }

        result.playersUpdated = playersUpdated
        result.message = "Médias recalculadas com sucesso"
        break

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Modo inválido. Use 'diagnose', 'fix', 'reset', ou 'recalculate'.",
          },
          { status: 400 },
        )
    }

    return NextResponse.json({
      success: true,
      mode,
      ...result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro durante operação de reparo:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro durante operação de reparo",
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

