import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    // Extrair parâmetros da URL para testar diferentes configurações
    const { searchParams } = new URL(request.url)

    // Log da string de conexão (com senha oculta)
    const dbUrl = process.env.DATABASE_URL || ""
    console.log("Testando conexão com MongoDB Atlas...")
    console.log("DATABASE_URL:", dbUrl.replace(/:([^:@]+)@/, ":***@"))

    // Tentar conectar usando Prisma
    await prisma.$connect()

    // Verificar conexão com o banco - contar jogadores
    const playerCount = await prisma.player.count()

    // Verificar conexão com o banco - contar registros
    const recordCount = await prisma.dpsRecord.count()

    // Obter amostra de jogador
    let playerSample = null
    if (playerCount > 0) {
      playerSample = await prisma.player.findFirst()
    }

    // Obter amostra de registro
    let recordSample = null
    if (recordCount > 0) {
      recordSample = await prisma.dpsRecord.findFirst()
    }

    return NextResponse.json({
      success: true,
      message: "Conexão com MongoDB Atlas estabelecida com sucesso!",
      playerCount,
      recordCount,
      playerSample,
      recordSample,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao conectar com MongoDB Atlas:", error)

    // Formatar mensagem de erro para melhor diagnóstico
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined

    return NextResponse.json(
      {
        success: false,
        error: "Falha na conexão com MongoDB Atlas",
        details: errorMessage,
        stack: errorStack,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}

