import { NextResponse } from "next/server"
import { deletePlayer } from "@/lib/db"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "ID do jogador não fornecido" }, { status: 400 })
    }

    const result = await deletePlayer(id)

    if (result.success) {
      return NextResponse.json({ message: "Jogador excluído com sucesso" })
    } else {
      return NextResponse.json({ error: "Erro ao excluir jogador" }, { status: 500 })
    }
  } catch (error) {
    console.error("Erro ao excluir jogador:", error)
    return NextResponse.json({ error: "Erro interno ao excluir jogador" }, { status: 500 })
  }
}

