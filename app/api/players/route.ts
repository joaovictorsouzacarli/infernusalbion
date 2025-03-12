import { type NextRequest, NextResponse } from "next/server"
import { getPlayersGroupedByClass, createDpsRecord, lastDataUpdate } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const players = await getPlayersGroupedByClass()
    return NextResponse.json(players, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "Last-Modified": new Date(lastDataUpdate).toUTCString(),
      },
    })
  } catch (error) {
    console.error("Error fetching players:", error)
    return NextResponse.json({ error: "Failed to fetch players" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Criar um registro de DPS/HPS
    const dpsRecord = {
      playerId: Date.now(),
      playerBaseId: data.playerBaseId || Date.now(),
      playerName: data.name,
      playerClass: data.class,
      dps: Number.parseInt(data.avgDps) || 0,
      rating: Number.parseInt(data.avgRating) || 0,
      date: new Date().toISOString(),
      huntType: "Regular",
      isHeal: data.isHealer || false,
    }

    const newRecord = await createDpsRecord(dpsRecord)
    return NextResponse.json(newRecord, { status: 201 })
  } catch (error) {
    console.error("Error creating player record:", error)
    return NextResponse.json({ error: "Failed to create player record" }, { status: 500 })
  }
}

