import { type NextRequest, NextResponse } from "next/server"
import { createDpsRecord, getDpsRecords, lastDataUpdate } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const records = await getDpsRecords()
    return NextResponse.json(records, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "Last-Modified": new Date(lastDataUpdate).toUTCString(),
      },
    })
  } catch (error) {
    console.error("Erro na rota GET /api/dps-records:", error)
    return NextResponse.json({ error: "Failed to fetch DPS records" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log("Dados recebidos na rota POST /api/dps-records:", JSON.stringify(data))

    // Validar dados recebidos
    if (!data.playerName || !data.playerClass || !data.dps) {
      return NextResponse.json(
        { error: "Dados inválidos. Nome do jogador, classe e DPS são obrigatórios." },
        { status: 400 },
      )
    }

    // Criar o registro de DPS
    const newRecord = await createDpsRecord({
      playerId: data.playerId || Date.now(),
      playerBaseId: data.playerBaseId || Date.now(),
      playerName: data.playerName,
      playerClass: data.playerClass,
      dps: data.dps,
      rating: data.rating || 0,
      date: data.date || new Date().toISOString().split("T")[0],
      huntType: data.huntType || "Dungeon",
      isHeal: data.isHeal || false,
    })

    console.log("Registro de DPS criado com sucesso na API:", JSON.stringify(newRecord))

    return NextResponse.json(newRecord, { status: 201 })
  } catch (error) {
    console.error("Erro detalhado na rota POST /api/dps-records:", error)
    return NextResponse.json(
      {
        error: "Failed to create DPS record",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

