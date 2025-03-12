// Tipos
export interface Player {
  _id?: string
  id?: number
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
  _id?: string
  id?: number
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

// Exportando uma variável para armazenar a última atualização
export let lastDataUpdate = Date.now()

// Armazenamento local - inicializado vazio
let players: Player[] = []
let dpsRecords: DpsRecord[] = []

// Função para gerar IDs únicos
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

// Funções para Players
export async function getPlayers() {
  return players
}

export async function getPlayerById(id: string) {
  return players.find((player) => player._id === id) || null
}

export async function getPlayerByBaseId(playerBaseId: number) {
  return players.find((player) => player.playerBaseId === playerBaseId) || null
}

// Função para obter jogadores agrupados por classe
export async function getPlayersGroupedByClass() {
  // Criar um mapa para armazenar jogadores por nome e classe
  const playerMap: Record<string, Record<string, Player>> = {}

  // Processar todos os registros de DPS
  for (const record of dpsRecords) {
    const playerKey = `${record.playerName}-${record.playerClass}`

    if (!playerMap[playerKey]) {
      playerMap[playerKey] = {
        _id: generateId(),
        playerBaseId: record.playerBaseId,
        name: record.playerName,
        guild: "INFERNUS", // Valor padrão
        class: record.playerClass,
        avgDps: "0",
        maxDps: "0",
        avgRating: "0",
        isHealer: record.isHeal,
      }
    }

    // Acumular dados para cálculo de médias
    const player = playerMap[playerKey]
    const records = dpsRecords.filter((r) => r.playerName === record.playerName && r.playerClass === record.playerClass)

    // Calcular médias e máximos
    const totalDps = records.reduce((sum, r) => sum + r.dps, 0)
    const totalRating = records.reduce((sum, r) => sum + r.rating, 0)
    const maxDps = Math.max(...records.map((r) => r.dps))

    player.avgDps = (totalDps / records.length).toFixed(0)
    player.maxDps = maxDps.toString()
    player.avgRating = (totalRating / records.length).toFixed(1)
  }

  // Converter o mapa em uma lista
  return Object.values(playerMap)
}

export async function createPlayer(player: Player) {
  const newPlayer = { ...player, _id: generateId() }
  players.push(newPlayer)
  // Atualizar timestamp
  lastDataUpdate = Date.now()
  return newPlayer
}

export async function updatePlayer(id: string, player: Partial<Player>) {
  const index = players.findIndex((p) => p._id === id)
  if (index !== -1) {
    players[index] = { ...players[index], ...player }
    // Atualizar timestamp
    lastDataUpdate = Date.now()
    return players[index]
  }
  return null
}

export async function deletePlayer(id: string) {
  players = players.filter((player) => player._id !== id)
  // Atualizar timestamp
  lastDataUpdate = Date.now()
  return { success: true }
}

// Funções para DpsRecords
export async function getDpsRecords() {
  return dpsRecords
}

export async function getDpsRecordById(id: string) {
  return dpsRecords.find((record) => record._id === id) || null
}

export async function getDpsRecordsByPlayerId(playerId: number) {
  return dpsRecords.filter((record) => record.playerId === playerId)
}

export async function createDpsRecord(record: DpsRecord) {
  const newRecord = { ...record, _id: generateId() }
  dpsRecords.push(newRecord)
  // Atualizar timestamp
  lastDataUpdate = Date.now()
  return newRecord
}

export async function updateDpsRecord(id: string, record: Partial<DpsRecord>) {
  const index = dpsRecords.findIndex((r) => r._id === id)
  if (index !== -1) {
    dpsRecords[index] = { ...dpsRecords[index], ...record }
    // Atualizar timestamp
    lastDataUpdate = Date.now()
    return dpsRecords[index]
  }
  return null
}

export async function deleteDpsRecord(id: string) {
  dpsRecords = dpsRecords.filter((record) => record._id !== id)
  // Atualizar timestamp
  lastDataUpdate = Date.now()
  return { success: true }
}

export async function clearAllData() {
  players = []
  dpsRecords = []
  // Atualizar timestamp
  lastDataUpdate = Date.now()
  return { success: true }
}

// Importar dados de exemplo (apenas quando solicitado explicitamente)
import { samplePlayers, sampleDpsRecords } from "./sample-data"

export async function initializeSampleData() {
  // Resetar os dados para os exemplos originais
  players = samplePlayers.map((player) => ({
    ...player,
    _id: generateId(),
  }))

  dpsRecords = sampleDpsRecords.map((record) => ({
    ...record,
    _id: generateId(),
  }))

  // Atualizar timestamp
  lastDataUpdate = Date.now()
  return { success: true }
}

