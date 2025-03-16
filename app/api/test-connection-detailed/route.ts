import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log("Iniciando teste detalhado de conexão com MongoDB...")

    // Verificar variáveis de ambiente
    const databaseUrl = process.env.DATABASE_URL || ""
    const maskedDatabaseUrl = databaseUrl.replace(/:([^:@]+)@/, ":***@")
    console.log("DATABASE_URL:", maskedDatabaseUrl)

    // Tentar conectar usando Prisma
    console.log("Tentando conectar via Prisma...")
    await prisma.$disconnect() // Garantir que não há conexões ativas
    await prisma.$connect()
    console.log("Conexão Prisma estabelecida com sucesso!")

    // Verificar se podemos executar operações no banco
    console.log("Testando operações no banco de dados...")

    // 1. Verificar se podemos contar registros
    const playerCount = await prisma.player.count()
    const recordCount = await prisma.dpsRecord.count()
    console.log(`Contagem: ${playerCount} jogadores, ${recordCount} registros`)

    // 2. Tentar criar um jogador de teste
    const testPlayer = await prisma.player.create({
      data: {
        playerBaseId: Date.now(),
        name: "Teste de Conexão",
        guild: "TESTE",
        class: "Teste",
        avgDps: "0",
        maxDps: "0",
        avgRating: "0",
        isHealer: false,
      },
    })
    console.log("Jogador de teste criado com sucesso:", testPlayer.id)

    // 3. Tentar excluir o jogador de teste
    await prisma.player.delete({
      where: { id: testPlayer.id },
    })
    console.log("Jogador de teste excluído com sucesso")

    return NextResponse.json({
      success: true,
      message: "Teste de conexão detalhado concluído com sucesso!",
      details: {
        connectionString: maskedDatabaseUrl,
        playerCount,
        recordCount,
        testOperations: {
          count: true,
          create: true,
          delete: true,
        },
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro detalhado no teste de conexão:", error)

    // Formatar mensagem de erro para melhor diagnóstico
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined

    return NextResponse.json(
      {
        success: false,
        error: "Falha no teste de conexão detalhado",
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

