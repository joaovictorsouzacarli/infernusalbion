import { NextResponse } from "next/server"
import { deleteDpsRecord } from "@/lib/db"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "ID do registro não fornecido" }, { status: 400 })
    }

    const result = await deleteDpsRecord(id)

    if (result.success) {
      return NextResponse.json({ message: "Registro excluído com sucesso" })
    } else {
      return NextResponse.json({ error: "Erro ao excluir registro" }, { status: 500 })
    }
  } catch (error) {
    console.error("Erro ao excluir registro:", error)
    return NextResponse.json({ error: "Erro interno ao excluir registro" }, { status: 500 })
  }
}

