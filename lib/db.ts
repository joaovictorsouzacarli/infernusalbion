// Tipos
import { prisma } from "./prisma"
import type { Player as PrismaPlayer, DpsRecord as PrismaDpsRecord } from "@prisma/client"

// Exportando uma variável para armazenar a última atualização
export let lastDataUpdate = Date.now()

export interface Player {
  id?: string | number // Adicionando id como alternativa ao _id
  _id?: string // Mantendo _id para compatibilidade
  playerBaseId: number
  name: string
  guild: string
  class: string
  avgDps: string
  maxDps: string
  avgRating: string
  isHealer: boolean
}

export interface DpsRecord {
  id?: string | number // Adicionando id como alternativa ao _id
  _id?: string // Mantendo _id para compatibilidade
  playerId: number
  playerBaseId: number
  playerName: string
  playerClass: string
  dps: number
  rating: number
  date: string
  huntType: string
  isHeal: boolean
}

// Função para converter um Player do Prisma para o formato da aplicação
function convertPrismaPlayer(player: PrismaPlayer): Player {
  return {
    _id: player.id, // Mapeando id do Prisma para _id
    id: player.id, // Também mapeando para id
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

// Função para converter um DpsRecord do Prisma para o formato da aplicação
function convertPrismaDpsRecord(record: PrismaDpsRecord): DpsRecord {
  return {
    _id: record.id, // Mapeando id do Prisma para _id
    id: record.id, // Também mapeando para id
    playerId: record.playerId,
    playerBaseId: record.playerBaseId,
    playerName: record.playerName,
    playerClass: record.playerClass,
    dps: record.dps,
    rating: record.rating,
    date: record.date,
    huntType: record.huntType,
    isHeal: record.isHeal,
  }
}

// Funções para Players
export async function getPlayers(): Promise<Player[]> {
  try {
    console.log("Buscando todos os jogadores do banco de dados...")
    const players = await prisma.player.findMany({
      orderBy: {
        avgDps: "desc",
      },
    })
    console.log(`Encontrados ${players.length} jogadores no banco de dados`)
    return players.map(convertPrismaPlayer)
  } catch (error) {
    console.error("Error fetching players:", error)
    return []
  }
}

export async function getPlayerById(id: string): Promise<Player | null> {
  try {
    const player = await prisma.player.findUnique({
      where: { id },
    })
    return player ? convertPrismaPlayer(player) : null
  } catch (error) {
    console.error("Error fetching player by ID:", error)
    return null
  }
}

export async function getPlayerByBaseId(playerBaseId: number): Promise<Player | null> {
  try {
    const player = await prisma.player.findFirst({
      where: { playerBaseId },
    })
    return player ? convertPrismaPlayer(player) : null
  } catch (error) {
    console.error("Error fetching player by base ID:", error)
    return null
  }
}

// Função simplificada para obter jogadores agrupados por classe
export async function getPlayersGroupedByClass(): Promise<Player[]> {
  try {
    // Simplesmente retornar todos os jogadores em vez de tentar calcular médias
    // Isso evita problemas com cálculos que podem estar causando erros
    return await getPlayers()
  } catch (error) {
    console.error("Error getting players grouped by class:", error)
    return []
  }
}

export async function createPlayer(player: Player): Promise<Player> {
  try {
    console.log("Iniciando criação do jogador:", player)

    // Verificar conexão com o banco
    await prisma.$connect()
    console.log("Conexão com o banco estabelecida")

    // Garantir que os valores são strings válidas
    const avgDps = player.avgDps || "0"
    const maxDps = player.maxDps || "0"
    const avgRating = player.avgRating || "0"

    const newPlayer = await prisma.player.create({
      data: {
        playerBaseId: player.playerBaseId,
        name: player.name,
        guild: player.guild || "INFERNUS",
        class: player.class,
        avgDps: avgDps,
        maxDps: maxDps,
        avgRating: avgRating,
        isHealer: player.isHealer,
      },
    })

    console.log("Jogador criado com sucesso:", newPlayer)
    return convertPrismaPlayer(newPlayer)
  } catch (error) {
    console.error("Erro detalhado ao criar jogador:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

export async function updatePlayer(id: string, player: Partial<Player>): Promise<Player | null> {
  try {
    const updatedPlayer = await prisma.player.update({
      where: { id },
      data: player,
    })

    // Atualizar timestamp
    lastDataUpdate = Date.now()

    return convertPrismaPlayer(updatedPlayer)
  } catch (error) {
    console.error("Error updating player:", error)
    return null
  }
}

export async function deletePlayer(id: string): Promise<{ success: boolean }> {
  try {
    await prisma.player.delete({
      where: { id },
    })

    // Atualizar timestamp
    lastDataUpdate = Date.now()

    return { success: true }
  } catch (error) {
    console.error("Error deleting player:", error)
    return { success: false }
  }
}

// Funções para DpsRecords
export async function getDpsRecords(): Promise<DpsRecord[]> {
  try {
    const records = await prisma.dpsRecord.findMany()
    return records.map(convertPrismaDpsRecord)
  } catch (error) {
    console.error("Error fetching DPS records:", error)
    return []
  }
}

export async function getDpsRecordById(id: string): Promise<DpsRecord | null> {
  try {
    const record = await prisma.dpsRecord.findUnique({
      where: { id },
    })
    return record ? convertPrismaDpsRecord(record) : null
  } catch (error) {
    console.error("Error fetching DPS record by ID:", error)
    return null
  }
}

export async function getDpsRecordsByPlayerId(playerId: number): Promise<DpsRecord[]> {
  try {
    const records = await prisma.dpsRecord.findMany({
      where: { playerId },
    })
    return records.map(convertPrismaDpsRecord)
  } catch (error) {
    console.error("Error fetching DPS records by player ID:", error)
    return []
  }
}

export async function createDpsRecord(record: DpsRecord): Promise<DpsRecord> {
  try {
    // Garantir que os valores numéricos sejam válidos
    const dps = typeof record.dps === "number" && !isNaN(record.dps) ? record.dps : 0
    const rating = typeof record.rating === "number" && !isNaN(record.rating) ? record.rating : 0

    const newRecord = await prisma.dpsRecord.create({
      data: {
        playerId: record.playerId,
        playerBaseId: record.playerBaseId,
        playerName: record.playerName,
        playerClass: record.playerClass,
        dps: dps,
        rating: rating,
        date: record.date,
        huntType: record.huntType,
        isHeal: record.isHeal,
      },
    })

    // Atualizar timestamp
    lastDataUpdate = Date.now()

    return convertPrismaDpsRecord(newRecord)
  } catch (error) {
    console.error("Error creating DPS record:", error)
    throw error
  }
}

export async function updateDpsRecord(id: string, record: Partial<DpsRecord>): Promise<DpsRecord | null> {
  try {
    const updatedRecord = await prisma.dpsRecord.update({
      where: { id },
      data: record,
    })

    // Atualizar timestamp
    lastDataUpdate = Date.now()

    return convertPrismaDpsRecord(updatedRecord)
  } catch (error) {
    console.error("Error updating DPS record:", error)
    return null
  }
}

export async function deleteDpsRecord(id: string): Promise<{ success: boolean }> {
  try {
    await prisma.dpsRecord.delete({
      where: { id },
    })

    // Atualizar timestamp
    lastDataUpdate = Date.now()

    return { success: true }
  } catch (error) {
    console.error("Error deleting DPS record:", error)
    return { success: false }
  }
}

export async function clearAllData(): Promise<{ success: boolean }> {
  try {
    // Deletar todos os registros
    await prisma.dpsRecord.deleteMany({})
    await prisma.player.deleteMany({})

    // Atualizar timestamp
    lastDataUpdate = Date.now()

    return { success: true }
  } catch (error) {
    console.error("Error clearing all data:", error)
    return { success: false }
  }
}

// Importar dados de exemplo (apenas quando solicitado explicitamente)
import { samplePlayers, sampleDpsRecords } from "./sample-data"

export async function initializeSampleData(): Promise<{ success: boolean }> {
  try {
    // Limpar dados existentes
    await clearAllData()

    // Inserir jogadores de exemplo
    for (const player of samplePlayers) {
      await prisma.player.create({
        data: {
          playerBaseId: player.playerBaseId,
          name: player.name,
          guild: player.guild,
          class: player.class,
          avgDps: player.avgDps,
          maxDps: player.maxDps,
          avgRating: player.avgRating,
          isHealer: player.isHealer,
        },
      })
    }

    // Inserir registros de DPS de exemplo
    for (const record of sampleDpsRecords) {
      await prisma.dpsRecord.create({
        data: {
          playerId: record.playerId,
          playerBaseId: record.playerBaseId,
          playerName: record.playerName,
          playerClass: record.playerClass,
          dps: record.dps,
          rating: record.rating,
          date: record.date,
          huntType: record.huntType,
          isHeal: record.isHeal,
        },
      })
    }

    // Atualizar timestamp
    lastDataUpdate = Date.now()

    return { success: true }
  } catch (error) {
    console.error("Error initializing sample data:", error)
    return { success: false }
  }
}

// Função para atualizar médias de jogadores com base nos registros
export async function updatePlayerAverages(): Promise<{ success: boolean }> {
  try {
    // Buscar todos os registros
    const records = await getDpsRecords()

    // Agrupar registros por jogador e classe
    const recordsByPlayerClass: Record<string, DpsRecord[]> = {}

    for (const record of records) {
      const key = `${record.playerName}-${record.playerClass}`
      if (!recordsByPlayerClass[key]) {
        recordsByPlayerClass[key] = []
      }
      recordsByPlayerClass[key].push(record)
    }

    // Buscar todos os jogadores
    const players = await getPlayers()

    // Atualizar cada jogador
    for (const player of players) {
      const key = `${player.name}-${player.class}`
      const playerRecords = recordsByPlayerClass[key] || []

      if (playerRecords.length > 0) {
        // Calcular médias de forma segura
        let totalDps = 0
        let totalRating = 0
        let maxDps = 0

        for (const record of playerRecords) {
          const dps = typeof record.dps === "number" ? record.dps : 0
          const rating = typeof record.rating === "number" ? record.rating : 0

          totalDps += dps
          totalRating += rating

          if (dps > maxDps) {
            maxDps = dps
          }
        }

        const avgDps = (totalDps / playerRecords.length).toFixed(0)
        const avgRating = (totalRating / playerRecords.length).toFixed(1)

        // Atualizar jogador
        await prisma.player.update({
          where: { id: player.id as string },
          data: {
            avgDps: avgDps,
            maxDps: maxDps.toString(),
            avgRating: avgRating,
          },
        })
      }
    }

    return { success: true }
  } catch (error) {
    console.error("Error updating player averages:", error)
    return { success: false }
  }
}

