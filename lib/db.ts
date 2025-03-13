import { PrismaClient, type Player as PrismaPlayer } from "@prisma/client"

const prisma = new PrismaClient()

export interface Player {
  playerBaseId?: number
  name: string
  guild?: string
  class: string
  avgDps?: string
  maxDps?: string
  avgRating?: string
  isHealer?: boolean
}

function convertPrismaPlayer(player: PrismaPlayer): Player {
  return {
    playerBaseId: player.playerBaseId,
    name: player.name,
    guild: player.guild,
    class: player.class,
    avgDps: player.avgDps,
    maxDps: player.maxDps,
    avgRating: player.avgRating,
    isHealer: player.isHealer,
  }
}

// Modificar a função createPlayer para melhor tratamento de erros
export async function createPlayer(player: Player): Promise<Player> {
  try {
    console.log("Iniciando criação do jogador:", JSON.stringify(player))

    // Verificar conexão com o banco
    await prisma.$connect()
    console.log("Conexão com o banco estabelecida")

    // Verificar se os dados do jogador são válidos
    if (!player.name || !player.class) {
      throw new Error("Dados do jogador inválidos: nome e classe são obrigatórios")
    }

    const newPlayer = await prisma.player.create({
      data: {
        playerBaseId: player.playerBaseId || Date.now(),
        name: player.name,
        guild: player.guild || "INFERNUS",
        class: player.class,
        avgDps: player.avgDps || "0",
        maxDps: player.maxDps || "0",
        avgRating: player.avgRating || "0",
        isHealer: player.isHealer || false,
      },
    })

    console.log("Jogador criado com sucesso:", JSON.stringify(newPlayer))
    return convertPrismaPlayer(newPlayer)
  } catch (error) {
    console.error("Erro detalhado ao criar jogador:", error)

    // Verificar se é um erro de conexão
    if (error instanceof Error && error.message.includes("connect")) {
      console.error("Erro de conexão com o MongoDB. Verifique a string de conexão e as credenciais.")
    }

    throw error
  } finally {
    await prisma.$disconnect()
  }
}

