import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Atualizar a variável global para forçar uma nova busca de dados
    global.lastDataUpdate = Date.now()

    return NextResponse.json({
      success: true,
      message: "Cache resetado com sucesso",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao resetar cache:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao resetar cache",
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

