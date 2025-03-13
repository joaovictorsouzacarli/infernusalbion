import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log("Testando conexão com MongoDB...")
    console.log("String de conexão:", process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ":***@")) // Oculta a senha

    // Testar a conexão
    await prisma.$connect()
    console.log("Conexão com MongoDB estabelecida com sucesso!")

    // Tentar criar um jogador de teste
    const testPlayer = await prisma.player.create({
      data: {
        playerBaseId: Date.now(),
        name: `Teste ${new Date().toISOString()}`,
        guild: "TESTE",
        class: "Teste",
        avgDps: "0",
        maxDps: "0",
        avgRating: "0",
        isHealer: false,
      },
    })

    console.log("Jogador de teste criado:", JSON.stringify(testPlayer))

    // Contar jogadores
    const playerCount = await prisma.player.count()

    return NextResponse.json({
      success: true,
      message: "Conexão com MongoDB estabelecida com sucesso!",
      testPlayer,
      playerCount,
      databaseUrl: process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ":***@"), // Oculta a senha
    })
  } catch (error) {
    console.error("Erro ao conectar com MongoDB:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        databaseUrl: process.env.DATABASE_URL?.replace(/:([^:@]+)@/, ":***@"), // Oculta a senha
      },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}

