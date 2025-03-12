import { type NextRequest, NextResponse } from "next/server"
import { getPlayerById, deletePlayer } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const player = await getPlayerById(id)

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 })
    }

    return NextResponse.json(player)
  } catch (error) {
    console.error("Error fetching player:", error)
    return NextResponse.json({ error: "Failed to fetch player" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const result = await deletePlayer(id)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error deleting player:", error)
    return NextResponse.json({ error: "Failed to delete player" }, { status: 500 })
  }
}

