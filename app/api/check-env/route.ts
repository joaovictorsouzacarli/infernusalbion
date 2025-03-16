import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Verificar variáveis de ambiente
    const databaseUrl = process.env.DATABASE_URL || ""
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || ""
    const nodeEnv = process.env.NODE_ENV || ""

    // Mascarar a senha na string de conexão
    const maskedDatabaseUrl = databaseUrl.replace(/:([^:@]+)@/, ":***@")

    // Verificar se a string de conexão está no formato correto
    const isMongoAtlasUrl = databaseUrl.includes("mongodb+srv://")

    // Verificar se a string de conexão contém os componentes necessários
    const hasUsername = databaseUrl.includes("dbuser")
    const hasCluster = databaseUrl.includes("cluster0.b9u3i.mongodb.net")
    const hasDatabase = databaseUrl.includes("albion_dps")

    return NextResponse.json({
      success: true,
      environment: {
        NODE_ENV: nodeEnv,
        NEXT_PUBLIC_API_URL: apiUrl,
        DATABASE_URL: maskedDatabaseUrl,
      },
      analysis: {
        isMongoAtlasUrl,
        hasUsername,
        hasCluster,
        hasDatabase,
        isComplete: isMongoAtlasUrl && hasUsername && hasCluster && hasDatabase,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Erro ao verificar variáveis de ambiente:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Erro ao verificar variáveis de ambiente",
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

