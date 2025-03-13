import { type NextRequest, NextResponse } from "next/server"
import { createPlayer, getPlayersGroupedByClass, lastDataUpdate } from "@/lib/db"

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
    console.error("Erro na rota GET /api/players:", error)
    return NextResponse.json({ error: "Failed to fetch players" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log("Dados recebidos na rota POST /api/players:", data)

    // Criar o jogador
    const newPlayer = await createPlayer({
      playerBaseId: Date.now(),
      name: data.name,
      guild: data.guild || "INFERNUS",
      class: data.class,
      avgDps: data.avgDps || "0",
      maxDps: data.maxDps || "0",
      avgRating: data.avgRating || "0",
      isHealer: data.isHealer || false,
    })

    console.log("Jogador criado com sucesso na API:", newPlayer)
    return NextResponse.json(newPlayer, { status: 201 })
  } catch (error) {
    console.error("Erro detalhado na rota POST /api/players:", error)
    return NextResponse.json(
      { error: "Failed to create player", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

