"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Medal, BarChart3, Users, Filter, Calendar } from "lucide-react"
import type { Player, DpsRecord } from "@/lib/db"
import { SiteHeader } from "@/components/site-header"

export default function EstatisticasPage() {
  const searchParams = useSearchParams()
  const playerParam = searchParams.get("player")
  const tabParam = searchParams.get("tab")

  const [players, setPlayers] = useState<Player[]>([])
  const [dpsRecords, setDpsRecords] = useState<DpsRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(playerParam || "")
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [playerRecords, setPlayerRecords] = useState<DpsRecord[]>([])
  const [sameClassPlayers, setSameClassPlayers] = useState<Player[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Buscar todos os jogadores e registros
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Buscar jogadores
        const playersRes = await fetch("/api/players?t=" + Date.now(), {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        })

        if (!playersRes.ok) {
          throw new Error("Falha ao carregar jogadores")
        }

        const playersData = await playersRes.json()
        setPlayers(playersData)

        // Buscar registros de DPS
        const recordsRes = await fetch("/api/dps-records?t=" + Date.now(), {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
        })

        if (!recordsRes.ok) {
          throw new Error("Falha ao carregar registros de DPS")
        }

        const recordsData = await recordsRes.json()
        setDpsRecords(recordsData)

        // Se tiver um parâmetro de jogador na URL, buscar esse jogador
        if (playerParam) {
          const foundPlayer = playersData.find((p) => p.name.toLowerCase() === playerParam.toLowerCase())

          if (foundPlayer) {
            handleSelectPlayer(foundPlayer)
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
        setError("Erro ao carregar dados. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [playerParam])

  // Filtrar jogadores com base na busca
  const filteredPlayers =
    searchQuery.trim() === ""
      ? []
      : players.filter((player) => player.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Selecionar um jogador para ver detalhes
  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayer(player)
    setSelectedClass(player.class)

    // Encontrar jogadores da mesma classe para comparação
    const sameClass = players.filter((p) => p.class === player.class && p.id !== player.id && p._id !== player._id)
    setSameClassPlayers(sameClass)

    // Encontrar registros deste jogador
    const records = dpsRecords.filter(
      (record) => record.playerName === player.name && record.playerClass === player.class,
    )
    setPlayerRecords(records)

    // Limpar a busca se não veio da URL
    if (!playerParam) {
      setSearchQuery("")
    }
  }

  // Filtrar por classe
  const handleFilterByClass = (className: string) => {
    setSelectedClass(className)

    if (selectedPlayer) {
      // Encontrar registros deste jogador com esta classe
      const records = dpsRecords.filter(
        (record) => record.playerName === selectedPlayer.name && record.playerClass === className,
      )
      setPlayerRecords(records)

      // Encontrar jogadores da mesma classe para comparação
      const sameClass = players.filter(
        (p) => p.class === className && p.id !== selectedPlayer.id && p._id !== selectedPlayer._id,
      )
      setSameClassPlayers(sameClass)
    }
  }

  // Calcular posição no ranking
  const getPlayerRank = (player: Player) => {
    if (!player) return { rank: 0, total: 0 }

    const relevantPlayers = players.filter((p) => p.isHealer === player.isHealer)
    const sortedPlayers = [...relevantPlayers].sort((a, b) => Number.parseInt(b.avgDps) - Number.parseInt(a.avgDps))
    const rank = sortedPlayers.findIndex((p) => p.id === player.id || p._id === player._id) + 1

    return { rank, total: relevantPlayers.length }
  }

  // Calcular estatísticas dos registros
  const calculateStats = () => {
    if (!playerRecords || playerRecords.length === 0) {
      return { avgDps: 0, maxDps: 0, totalRecords: 0 }
    }

    const totalDps = playerRecords.reduce((sum, record) => sum + record.dps, 0)
    const avgDps = Math.round(totalDps / playerRecords.length)
    const maxDps = Math.max(...playerRecords.map((record) => record.dps))

    return {
      avgDps,
      maxDps,
      totalRecords: playerRecords.length,
    }
  }

  const stats = calculateStats()

  // Obter classes únicas do jogador selecionado
  const getPlayerClasses = () => {
    if (!selectedPlayer) return []

    const playerName = selectedPlayer.name.split(" - ")[0] // Pegar apenas o nome base do jogador

    // Encontrar todos os registros deste jogador (independente da classe)
    const allRecords = dpsRecords.filter((record) => record.playerName.toLowerCase().includes(playerName.toLowerCase()))

    // Extrair classes únicas
    const uniqueClasses = [...new Set(allRecords.map((record) => record.playerClass))]
    return uniqueClasses
  }

  const playerClasses = getPlayerClasses()

  return (
    <div className="flex min-h-screen flex-col bg-black/95 text-white relative">
      <SiteHeader />

      <main className="flex-1">
        <div className="container py-10">
          <div className="flex items-center mb-6">
            <Link href="/">
              <Button variant="outline" size="sm" className="border-yellow-600 text-yellow-500">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <h2 className="text-3xl font-bold text-yellow-500 ml-4">Estatísticas Detalhadas</h2>
          </div>

          {error && <div className="bg-red-900/30 border border-red-800 text-red-200 p-4 rounded-md mb-6">{error}</div>}

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
          ) : (
            <>
              <Card className="bg-gray-900 border-yellow-900/50 mb-8">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-yellow-500 mb-4">Buscar Jogador</h3>

                  <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        type="text"
                        placeholder="Digite o nome do jogador..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="border-yellow-600 text-yellow-500"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      Filtros
                    </Button>
                  </div>

                  {searchQuery.trim() !== "" && (
                    <div className="mt-4 max-h-60 overflow-y-auto">
                      {filteredPlayers.length > 0 ? (
                        <div className="space-y-2">
                          {filteredPlayers.map((player) => (
                            <div
                              key={player.id || player._id}
                              className="flex items-center justify-between p-2 rounded-md hover:bg-gray-800 cursor-pointer"
                              onClick={() => handleSelectPlayer(player)}
                            >
                              <div className="flex items-center gap-2">
                                <div className="font-medium">{player.name}</div>
                                <div className="text-xs text-gray-400">{player.class}</div>
                              </div>
                              <div className="text-yellow-500">
                                {player.isHealer ? `${player.avgDps} HPS` : `${player.avgDps} DPS`}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 py-2">Nenhum jogador encontrado com esse nome</div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {selectedPlayer && (
                <div className="space-y-6">
                  <Card className="bg-gray-900 border-yellow-900/50">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                        <div>
                          <h3 className="text-2xl font-bold text-yellow-500">{selectedPlayer.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="bg-yellow-600/20 text-yellow-400 text-xs px-2 py-1 rounded">
                              {selectedClass || selectedPlayer.class}
                            </span>
                            <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">
                              {selectedPlayer.isHealer ? "Healer" : "DPS"}
                            </span>
                            <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">
                              {selectedPlayer.guild}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 md:mt-0 flex items-center">
                          {getPlayerRank(selectedPlayer).rank <= 3 && (
                            <Medal
                              className={`h-6 w-6 mr-2 ${
                                getPlayerRank(selectedPlayer).rank === 1
                                  ? "text-yellow-400"
                                  : getPlayerRank(selectedPlayer).rank === 2
                                    ? "text-gray-400"
                                    : "text-amber-700"
                              }`}
                            />
                          )}
                          <div className="text-right">
                            <div className="text-sm text-gray-400">
                              Ranking: {getPlayerRank(selectedPlayer).rank} de {getPlayerRank(selectedPlayer).total}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Filtro de classes do jogador */}
                      {playerClasses.length > 1 && (
                        <div className="mb-6 bg-gray-800/50 p-3 rounded-lg">
                          <div className="text-sm text-gray-400 mb-2 flex items-center">
                            <Filter className="h-4 w-4 mr-1" />
                            Classes do jogador:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {playerClasses.map((className) => (
                              <Button
                                key={className}
                                variant="outline"
                                size="sm"
                                className={`text-xs ${
                                  selectedClass === className
                                    ? "bg-yellow-600/20 text-yellow-400 border-yellow-600"
                                    : "border-gray-700 text-gray-400"
                                }`}
                                onClick={() => handleFilterByClass(className)}
                              >
                                {className}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col items-center">
                          <div className="text-gray-400 text-sm mb-1">
                            Média de {selectedPlayer.isHealer ? "HPS" : "DPS"}
                          </div>
                          <div className="text-2xl font-bold text-yellow-500">
                            {stats.totalRecords > 0 ? stats.avgDps : selectedPlayer.avgDps}
                          </div>
                        </div>

                        <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col items-center">
                          <div className="text-gray-400 text-sm mb-1">
                            Máximo {selectedPlayer.isHealer ? "HPS" : "DPS"}
                          </div>
                          <div className="text-2xl font-bold text-yellow-500">
                            {stats.totalRecords > 0 ? stats.maxDps : selectedPlayer.maxDps}
                          </div>
                        </div>

                        <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col items-center">
                          <div className="text-gray-400 text-sm mb-1">Partidas Registradas</div>
                          <div className="text-2xl font-bold text-yellow-500">{stats.totalRecords}</div>
                        </div>
                      </div>

                      {/* Histórico de partidas */}
                      {playerRecords.length > 0 && (
                        <div className="mb-6">
                          <div className="flex items-center gap-2 text-gray-400 mb-2">
                            <Calendar className="h-4 w-4" />
                            <h4 className="font-medium">Histórico de Partidas</h4>
                          </div>

                          <div className="bg-gray-800/30 rounded-lg overflow-hidden">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-black/30 text-xs">
                                  <th className="px-3 py-2 text-left text-gray-400">Data</th>
                                  <th className="px-3 py-2 text-left text-gray-400">Tipo</th>
                                  <th className="px-3 py-2 text-right text-gray-400">
                                    {selectedPlayer.isHealer ? "HPS" : "DPS"}
                                  </th>
                                  <th className="px-3 py-2 text-right text-gray-400">Nota</th>
                                </tr>
                              </thead>
                              <tbody>
                                {playerRecords.map((record) => (
                                  <tr key={record.id || record._id} className="border-t border-gray-800/50">
                                    <td className="px-3 py-2 text-sm text-gray-300">{record.date}</td>
                                    <td className="px-3 py-2 text-sm text-gray-300">{record.huntType}</td>
                                    <td className="px-3 py-2 text-sm text-yellow-500 text-right">{record.dps}</td>
                                    <td className="px-3 py-2 text-sm text-yellow-500 text-right">{record.rating}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <BarChart3 className="h-4 w-4" />
                        <h4 className="font-medium">Comparação com outros jogadores da mesma classe</h4>
                      </div>

                      {sameClassPlayers.length > 0 ? (
                        <div className="space-y-3 mt-4">
                          {sameClassPlayers.map((player) => (
                            <div key={player.id || player._id} className="flex items-center justify-between">
                              <div className="font-medium">{player.name}</div>
                              <div className="flex items-center gap-4">
                                <div className="text-sm">
                                  <span className="text-gray-400">Média: </span>
                                  <span
                                    className={`font-medium ${
                                      Number.parseInt(player.avgDps) > Number.parseInt(selectedPlayer.avgDps)
                                        ? "text-green-500"
                                        : Number.parseInt(player.avgDps) < Number.parseInt(selectedPlayer.avgDps)
                                          ? "text-red-500"
                                          : "text-yellow-500"
                                    }`}
                                  >
                                    {player.avgDps}
                                  </span>
                                </div>
                                <div className="text-sm">
                                  <span className="text-gray-400">Máx: </span>
                                  <span
                                    className={`font-medium ${
                                      Number.parseInt(player.maxDps) > Number.parseInt(selectedPlayer.maxDps)
                                        ? "text-green-500"
                                        : Number.parseInt(player.maxDps) < Number.parseInt(selectedPlayer.maxDps)
                                          ? "text-red-500"
                                          : "text-yellow-500"
                                    }`}
                                  >
                                    {player.maxDps}
                                  </span>
                                </div>
                                <div className="text-sm">
                                  <span className="text-gray-400">Nota: </span>
                                  <span
                                    className={`font-medium ${
                                      Number.parseFloat(player.avgRating) > Number.parseFloat(selectedPlayer.avgRating)
                                        ? "text-green-500"
                                        : Number.parseFloat(player.avgRating) <
                                            Number.parseFloat(selectedPlayer.avgRating)
                                          ? "text-red-500"
                                          : "text-yellow-500"
                                    }`}
                                  >
                                    {player.avgRating}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-gray-500 py-4 bg-gray-800/30 rounded-md">
                          <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          Não há outros jogadores com a classe {selectedClass || selectedPlayer.class} para comparação
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {!selectedPlayer && !isLoading && (
                <div className="text-center py-10 bg-gray-900/30 rounded-lg border border-gray-800">
                  <Search className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                  <h3 className="text-xl font-medium text-gray-400 mb-2">Busque por um jogador</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Digite o nome de um jogador na barra de busca acima para ver estatísticas detalhadas e comparações
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <footer className="border-t border-yellow-900/50 bg-black">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} INFERNUS CAÇADAS. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}

