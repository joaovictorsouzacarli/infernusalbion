import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

export async function GET(request: Request) {
  try {
    // Extrair parâmetros da URL para testar diferentes configurações
    const { searchParams } = new URL(request.url)
    const useDirectConnection = searchParams.get("direct") === "true"

    // Construir a string de conexão correta para MongoDB Atlas
    const username = encodeURIComponent("dbuser")
    const password = encodeURIComponent("javalol")
    const cluster = "cluster0.b9u3i.mongodb.net"
    const database = "albion_dps"

    // Opções de conexão
    const options = [
      "retryWrites=true",
      "w=majority",
      useDirectConnection ? "directConnection=true" : "",
      "appName=Cluster0",
    ]
      .filter(Boolean)
      .join("&")

    // String de conexão completa
    const uri = `mongodb+srv://${username}:${password}@${cluster}/${database}?${options}`

    console.log("Testando conexão com MongoDB Atlas...")
    console.log("URI (com senha oculta):", uri.replace(/:([^:@]+)@/, ":***@"))

    // Tentar conectar
    const client = new MongoClient(uri)
    await client.connect()

    // Verificar conexão com o banco
    const db = client.db(database)
    const collections = await db.listCollections().toArray()

    // Contar documentos nas coleções
    const stats = {}
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments()
      stats[collection.name] = count
    }

    // Fechar conexão
    await client.close()

    return NextResponse.json({
      success: true,
      message: "Conexão com MongoDB Atlas estabelecida com sucesso!",
      collections: collections.map((c) => c.name),
      stats,
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
  }
}

