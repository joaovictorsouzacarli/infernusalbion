import { prisma } from "./prisma"
import type { Player as PrismaPlayer, DpsRecord as PrismaDpsRecord } from "@prisma/client"

// Exportando uma variável para armazenar a última atualização
export const lastDataUpdate = Date.now()

export interface Player {
  id?: string
  _id?: string
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
  id?: string
  _id?: string
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
    id: player.id,
    _id: player.id,
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
    id: record.id,
    _id: record.id,
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

// Funções básicas para Players
export async function getPlayers(): Promise<Player[]> {
  try {
    const players = await prisma.player.findMany({
      orderBy: {
        avgDps: "desc",
      },
    })
    return players.map(convertPrismaPlayer)
  } catch (error) {
    console.error("Error fetching players:", error)
    return []
  }
}

export async function createPlayer(player: Player): Promise<Player> {
  try {
    const newPlayer = await prisma.player.create({
      data: {
        playerBaseId: player.playerBaseId,
        name: player.name,
        guild: player.guild || "INFERNUS",
        class: player.class,
        avgDps: player.avgDps || "0",
        maxDps: player.maxDps || "0",
        avgRating: player.avgRating || "0",
        isHealer: player.isHealer,
      },
    })
    return convertPrismaPlayer(newPlayer)
  } catch (error) {
    console.error("Error creating player:", error)
    throw error
  }
}

export async function deletePlayer(id: string): Promise<{ success: boolean }> {
  try {
    await prisma.player.delete({
      where: { id },
    })
    return { success: true }
  } catch (error) {
    console.error("Error deleting player:", error)
    return { success: false }
  }
}

// Funções básicas para DpsRecords
export async function getDpsRecords(): Promise<DpsRecord[]> {
  try {
    const records = await prisma.dpsRecord.findMany()
    return records.map(convertPrismaDpsRecord)
  } catch (error) {
    console.error("Error fetching DPS records:", error)
    return []
  }
}

export async function createDpsRecord(record: DpsRecord): Promise<DpsRecord> {
  try {
    const newRecord = await prisma.dpsRecord.create({
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
    return convertPrismaDpsRecord(newRecord)
  } catch (error) {
    console.error("Error creating DPS record:", error)
    throw error
  }
}

export async function deleteDpsRecord(id: string): Promise<{ success: boolean }> {
  try {
    await prisma.dpsRecord.delete({
      where: { id },
    })
    return { success: true }
  } catch (error) {
    console.error("Error deleting DPS record:", error)
    return { success: false }
  }
}

// Importar dados de exemplo
import { samplePlayers, sampleDpsRecords } from "./sample-data"

export async function initializeSampleData(): Promise<{ success: boolean }> {
  try {
    // Limpar dados existentes
    await prisma.dpsRecord.deleteMany({})
    await prisma.player.deleteMany({})

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

    return { success: true }
  } catch (error) {
    console.error("Error initializing sample data:", error)
    return { success: false }
  }
}

