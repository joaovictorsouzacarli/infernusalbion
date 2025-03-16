import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import { samplePlayers, sampleDpsRecords } from "@/lib/sample-data"

export async function GET(request: Request) {
  try {
    // Extrair parâmetros da URL
    const { searchParams } = new URL(request.url)
    const force = searchParams.get("force") === "true"

    // Construir a string de conexão
    const username = encodeURIComponent("dbuser")
    const password = encodeURIComponent("javalol")
    const cluster = "cluster0.b9u3i.mongodb.net"
    const database = "albion_dps"

    // Opções de conexão
    const options = ["retryWrites=true", "w=majority", "appName=Cluster0"].filter(Boolean).join("&")

    // String de conexão completa
    const uri = `mongodb+srv://${username}:${password}@${cluster}/${database}?${options}`

    console.log("Conectando ao MongoDB Atlas para inicializar banco de dados...")

    // Conectar ao MongoDB diretamente (sem Prisma)
    const client = new MongoClient(uri)
    await client.connect()

    const db = client.db(database)

    // Verificar se já existem dados
    const playerCount = await db.collection("Player").countDocuments()
    const recordCount = await db.collection("DpsRecord").countDocuments()

    console.log(`Estado atual: ${playerCount} jogadores, ${recordCount} registros`)

    // Se já existem dados e não foi forçado, não fazer nada
    if ((playerCount > 0 || recordCount > 0) && !force) {
      await client.close()
      return NextResponse.json({
        success: true,
        message: "Banco de dados já contém dados. Use ?force=true para reinicializar.",
        playerCount,
        recordCount,
        timestamp: new Date().toISOString(),
      })
    }

    // Limpar coleções existentes
    await db.collection("Player").deleteMany({})
    await db.collection("DpsRecord").deleteMany({})

    console.log("Coleções limpas com sucesso")

    // Inserir jogadores de exemplo
    const playerResult = await db.collection("Player").insertMany(
      samplePlayers.map((player) => ({
        playerBaseId: player.playerBaseId,
        name: player.name,
        guild: player.guild,
        class: player.class,
        avgDps: player.avgDps,
        maxDps: player.maxDps,
        avgRating: player.avgRating,
        isHealer: player.isHealer,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    )

    // Inserir registros de DPS de exemplo
    const recordResult = await db.collection("DpsRecord").insertMany(
      sampleDpsRecords.map((record) => ({
        playerId: record.playerId,
        playerBaseId: record.playerBaseId,
        playerName: record.playerName,
        playerClass: record.playerClass,
        dps: record.dps,
        rating: record.rating,
        date: record.date,
        huntType: record.huntType,
        isHeal: record.isHeal,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    )

    // Fechar conexão
    await client.close()

    return NextResponse.json({
      success: true,
      message: "Banco de dados inicializado com sucesso",
      playersInserted: playerResult.insertedCount,
      recordsInserted: recordResult.insertedCount,
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
  }
}

