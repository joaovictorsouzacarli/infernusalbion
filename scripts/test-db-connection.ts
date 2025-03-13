import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  try {
    console.log("Tentando conectar ao MongoDB...")

    // Testar a conexão
    await prisma.$connect()
    console.log("Conexão com MongoDB estabelecida com sucesso!")

    // Tentar criar um jogador de teste
    const player = await prisma.player.create({
      data: {
        playerBaseId: Date.now(),
        name: "Teste de Conexão",
        guild: "INFERNUS",
        class: "Teste",
        avgDps: "1000",
        maxDps: "2000",
        avgRating: "5.0",
        isHealer: false,
      },
    })

    console.log("Jogador criado com sucesso:", player)

    // Listar todos os jogadores
    const players = await prisma.player.findMany()
    console.log("Jogadores no banco:", players)
  } catch (error) {
    console.error("Erro ao conectar ou interagir com o MongoDB:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()

