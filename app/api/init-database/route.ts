import { NextResponse } from "next/server"
import { initializeSampleData } from "@/lib/db"

export async function GET() {
  try {
    const result = await initializeSampleData()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Banco de dados inicializado com sucesso",
        timestamp: new Date().toISOString(),
      })
    } else {
      throw new Error("Falha ao inicializar banco de dados")
    }
  } catch (error) {
    console.error("Erro ao inicializar banco de dados:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Falha ao inicializar banco de dados",
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

