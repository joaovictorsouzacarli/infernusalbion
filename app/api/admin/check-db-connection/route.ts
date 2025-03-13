import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Usar uma operação compatível com MongoDB em vez de $queryRaw
    // Vamos tentar buscar um único registro para verificar a conexão
    await prisma.player.findFirst({
      take: 1,
    })

    return NextResponse.json({ connected: true })
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
    return NextResponse.json({ connected: false, error: String(error) })
  }
}

