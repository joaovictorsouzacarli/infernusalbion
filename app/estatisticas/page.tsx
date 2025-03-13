"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Medal, BarChart3, Users } from "lucide-react"
import type { Player } from "@/lib/db"
import { SiteHeader } from "@/components/site-header"

export default function EstatisticasPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [sameClassPlayers, setSameClassPlayers] = useState<Player[]>([])
  const [error, setError] = useState<string | null>(null)

  // Buscar todos os jogadores
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setIsLoading(true)
        const res = await fetch("/api/players")

        if (!res.ok) {
          throw new Error("Falha ao carregar jogadores")
        }

        const data = await res.json()
        setPlayers(data)
      } catch (error) {
        console.error("Erro ao buscar jogadores:", error)
        setError("Erro ao carregar dados. Tente novamente mais tarde.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlayers()
  }, [])

  // Filtrar jogadores com base na busca
  const filteredPlayers =
    searchQuery.trim() === ""
      ? []
      : players.filter((player) => player.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Selecionar um jogador para ver detalhes
  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayer(player)

    // Encontrar jogadores da mesma classe para comparação
    const sameClass = players.filter((p) => p.class === player.class && p.id !== player.id && p._id !== player._id)
    setSameClassPlayers(sameClass)

    // Limpar a busca
    setSearchQuery("")
  }

  // Calcular posição no ranking
  const getPlayerRank = (player: Player) => {
    if (!player) return { rank: 0, total: 0 }

    const relevantPlayers = players.filter((p) => p.isHealer === player.isHealer)
    const sortedPlayers = [...relevantPlayers].sort((a, b) => Number.parseInt(b.avgDps) - Number.parseInt(a.avgDps))
    const rank = sortedPlayers.findIndex((p) => p.id === player.id || p._id === player._id) + 1

    return { rank, total: relevantPlayers.length }
  }

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
                              {selectedPlayer.class}
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

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col items-center">
                          <div className="text-gray-400 text-sm mb-1">
                            Média de {selectedPlayer.isHealer ? "HPS" : "DPS"}
                          </div>
                          <div className="text-2xl font-bold text-yellow-500">{selectedPlayer.avgDps}</div>
                        </div>

                        <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col items-center">
                          <div className="text-gray-400 text-sm mb-1">
                            Máximo {selectedPlayer.isHealer ? "HPS" : "DPS"}
                          </div>
                          <div className="text-2xl font-bold text-yellow-500">{selectedPlayer.maxDps}</div>
                        </div>

                        <div className="bg-gray-800/50 rounded-lg p-4 flex flex-col items-center">
                          <div className="text-gray-400 text-sm mb-1">Nota Média</div>
                          <div className="text-2xl font-bold text-yellow-500">{selectedPlayer.avgRating}</div>
                        </div>
                      </div>

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
                          Não há outros jogadores com a classe {selectedPlayer.class} para comparação
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

