"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { BarChart, LineChart, Search, User, ArrowUpDown, Award, Activity } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import type { Player, DpsRecord } from "@/lib/db"

// Mapeamento de classes para ícones
const classIcons = {
  Tank: "https://render.albiononline.com/v1/item/T8_MAIN_MACE_HELL",
  Quedasanta: "https://render.albiononline.com/v1/item/T8_MAIN_HOLYSTAFF_AVALON",
  Shadowcaller: "https://render.albiononline.com/v1/item/T8_MAIN_CURSEDSTAFF_AVALON@1",
  Quebrareinos: "https://render.albiononline.com/v1/item/T8_2H_AXE_AVALON",
  Águia: "https://render.albiononline.com/v1/item/T8_2H_SHAPESHIFTER_AVALON",
  Frost: "https://render.albiononline.com/v1/item/T8_MAIN_FROSTSTAFF_AVALON@1",
  Adagas: "https://render.albiononline.com/v1/item/T8_MAIN_DAGGER",
  Endemoniado: "https://render.albiononline.com/v1/item/T8_2H_SHAPESHIFTER_HELL",
  Fulgurante: "https://render.albiononline.com/v1/item/T8_2H_INFERNOSTAFF_MORGANA",
  Furabruma: "https://render.albiononline.com/v1/item/T8_2H_BOW_AVALON",
}

// Lista de classes que são healers
const healerClasses = ["Quedasanta"]

// Função para calcular porcentagens de classes
const calculateClassPercentages = (players: Player[]) => {
  const classCounts: Record<string, number> = {}

  // Contar o número de jogadores por classe
  players.forEach((player) => {
    if (!classCounts[player.class]) {
      classCounts[player.class] = 0
    }
    classCounts[player.class]++
  })

  // Calcular percentagens
  const total = players.length
  const percentages: { class: string; count: number; percentage: number }[] = []

  for (const [className, count] of Object.entries(classCounts)) {
    percentages.push({
      class: className,
      count,
      percentage: Math.round((count / total) * 100),
    })
  }

  // Ordenar por contagem (do maior para o menor)
  return percentages.sort((a, b) => b.count - a.count)
}

// Cores para o gráfico
const chartColors = [
  "bg-yellow-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-emerald-500",
  "bg-cyan-500",
]

export default function Estatisticas() {
  const [players, setPlayers] = useState<Player[]>([])
  const [dpsRecords, setDpsRecords] = useState<DpsRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const timestamp = Date.now()

  // Estado para pesquisa de jogador
  const [playerSearch, setPlayerSearch] = useState("")
  const [searchedPlayer, setSearchedPlayer] = useState<string | null>(null)
  const [playerStats, setPlayerStats] = useState<{
    byClass: Record<
      string,
      {
        avgDps: number
        maxDps: number
        avgRating: number
        count: number
        percentile: number
        rank: number
      }
    >
    totalParticipations: number
  } | null>(null)

  // Estatísticas calculadas
  const [classStats, setClassStats] = useState<{ class: string; count: number; percentage: number }[]>([])
  const [totalPlayers, setTotalPlayers] = useState(0)
  const [avgDps, setAvgDps] = useState("0")
  const [totalHealers, setTotalHealers] = useState(0)
  const [totalDpsers, setTotalDpsers] = useState(0)

  // Buscar dados
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Buscar jogadores
        const playersResponse = await fetch(`/api/players?t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        })

        // Buscar registros de DPS
        const recordsResponse = await fetch(`/api/dps-records?t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        })

        if (playersResponse.ok && recordsResponse.ok) {
          const playersData = await playersResponse.json()
          const recordsData = await recordsResponse.json()

          setPlayers(playersData)
          setDpsRecords(recordsData)

          // Calcular estatísticas
          setTotalPlayers(playersData.length)
          setClassStats(calculateClassPercentages(playersData))

          // Calcular média de DPS/HPS
          const dpsSum = playersData.reduce(
            (sum: number, player: Player) => sum + Number.parseFloat(player.avgDps || "0"),
            0,
          )
          setAvgDps((dpsSum / (playersData.length || 1)).toFixed(2))

          // Contar healers e dpsers
          const healers = playersData.filter((player) => player.isHealer).length
          setTotalHealers(healers)
          setTotalDpsers(playersData.length - healers)
        } else {
          setError("Falha ao carregar dados")
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
        setError("Erro ao carregar dados")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Função para pesquisar jogador
  const searchPlayer = () => {
    if (!playerSearch.trim()) return

    setSearchedPlayer(playerSearch)

    // Filtrar registros do jogador
    const playerRecords = dpsRecords.filter((record) => record.playerName.toLowerCase() === playerSearch.toLowerCase())

    if (playerRecords.length === 0) {
      setPlayerStats(null)
      return
    }

    // Agrupar por classe
    const classesByPlayer: Record<string, DpsRecord[]> = {}

    playerRecords.forEach((record) => {
      if (!classesByPlayer[record.playerClass]) {
        classesByPlayer[record.playerClass] = []
      }
      classesByPlayer[record.playerClass].push(record)
    })

    // Calcular estatísticas por classe
    const statsByClass: Record<string, any> = {}

    Object.entries(classesByPlayer).forEach(([className, records]) => {
      // Calcular médias para esta classe
      const totalDps = records.reduce((sum, r) => sum + r.dps, 0)
      const totalRating = records.reduce((sum, r) => sum + r.rating, 0)
      const maxDps = Math.max(...records.map((r) => r.dps))

      // Calcular percentil e ranking
      // Encontrar todos os jogadores com esta classe
      const classPlayers = players.filter((p) => p.class === className)
      const avgDpsValue = totalDps / records.length

      // Ordenar jogadores por DPS médio
      const sortedPlayers = [...classPlayers].sort((a, b) => Number.parseFloat(b.avgDps) - Number.parseFloat(a.avgDps))

      // Encontrar posição do jogador
      const playerRank = sortedPlayers.findIndex((p) => p.name.toLowerCase() === playerSearch.toLowerCase()) + 1

      // Calcular percentil (quanto maior o percentil, melhor)
      const percentile =
        playerRank > 0 ? Math.round(((classPlayers.length - playerRank + 1) / classPlayers.length) * 100) : 0

      statsByClass[className] = {
        avgDps: Number.parseFloat((totalDps / records.length).toFixed(2)),
        maxDps: maxDps,
        avgRating: Number.parseFloat((totalRating / records.length).toFixed(1)),
        count: records.length,
        percentile: percentile,
        rank: playerRank,
      }
    })

    setPlayerStats({
      byClass: statsByClass,
      totalParticipations: playerRecords.length,
    })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="mb-4 text-yellow-500 text-xl">Carregando...</div>
          <div className="text-gray-400 text-sm">Aguarde enquanto os dados estatísticos são carregados</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="mb-4 text-red-500 text-xl">Erro</div>
          <div className="text-gray-400 text-sm">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="sticky top-0 z-10 bg-black border-b border-yellow-600">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SWAP_4.png-1E01OYWrRQZhycLojFhDgjHeUCjw8l.jpeg"
              width={40}
              height={40}
              alt="Infernus Logo"
              className="rounded-md"
            />
            <h1 className="text-xl font-bold text-yellow-500">INFERNUS CAÇADAS</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href={`/?t=${timestamp}`} className="text-sm font-medium text-gray-400 hover:text-yellow-500">
              Rankings
            </Link>
            <Link href={`/estatisticas?t=${timestamp}`} className="text-sm font-medium text-yellow-500">
              Estatísticas
            </Link>
          </nav>
          <Button variant="outline" size="icon" className="md:hidden border-yellow-600 text-yellow-500">
            <span className="sr-only">Menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </header>

      <div className="relative w-full h-48 md:h-64 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10"></div>
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SWAP_4.png-1E01OYWrRQZhycLojFhDgjHeUCjw8l.jpeg"
          fill
          alt="Infernus Background"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-yellow-500">Estatísticas de Desempenho</h2>
            <p className="text-gray-400">Análise detalhada dos jogadores e desempenho</p>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="container py-6 md:py-12">
          {/* Pesquisa de jogador */}
          <Card className="bg-gray-900 border-yellow-900 mb-8">
            <CardHeader>
              <CardTitle className="text-yellow-500">Pesquisar Jogador</CardTitle>
              <CardDescription className="text-gray-400">
                Digite o nome de um jogador para ver suas estatísticas detalhadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Nome do jogador..."
                    className="pl-8 bg-gray-800 border-gray-700 text-white"
                    value={playerSearch}
                    onChange={(e) => setPlayerSearch(e.target.value)}
                  />
                </div>
                <Button onClick={searchPlayer} className="bg-yellow-600 hover:bg-yellow-700 text-black">
                  Buscar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Resultados da pesquisa de jogador */}
          {searchedPlayer && (
            <div className="mb-8">
              <h3 className="text-xl font-bold text-yellow-500 mb-4">Estatísticas de {searchedPlayer}</h3>

              {!playerStats ? (
                <Card className="bg-gray-900 border-yellow-900">
                  <CardContent className="p-6">
                    <div className="text-center text-gray-500">Nenhum registro encontrado para este jogador.</div>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
                    <Card className="bg-gray-900 border-yellow-900">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Total de Participações</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">{playerStats.totalParticipations}</div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-900 border-yellow-900">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Classes Jogadas</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-yellow-500">
                          {Object.keys(playerStats.byClass).length}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-900 border-yellow-900">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Melhor Classe</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {Object.entries(playerStats.byClass).length > 0 ? (
                          <div className="text-2xl font-bold text-yellow-500">
                            {
                              Object.entries(playerStats.byClass).sort(
                                (a, b) => b[1].percentile - a[1].percentile,
                              )[0][0]
                            }
                          </div>
                        ) : (
                          <div className="text-2xl font-bold text-gray-500">-</div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="bg-gray-900 border-yellow-900">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">Melhor Percentil</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {Object.entries(playerStats.byClass).length > 0 ? (
                          <div className="text-2xl font-bold text-yellow-500">
                            {Math.max(...Object.values(playerStats.byClass).map((stat) => stat.percentile))}%
                          </div>
                        ) : (
                          <div className="text-2xl font-bold text-gray-500">-</div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Detalhes por classe */}
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(playerStats.byClass).map(([className, stats]) => (
                      <Card key={className} className="bg-gray-900 border-yellow-900">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <div className="h-6 w-6">
                              <Image
                                src={
                                  classIcons[className] ||
                                  `/placeholder.svg?height=24&width=24&text=${className.charAt(0) || "/placeholder.svg"}`
                                }
                                width={24}
                                height={24}
                                alt={className}
                                className="rounded bg-yellow-900/50"
                              />
                            </div>
                            <CardTitle className="text-yellow-500">{className}</CardTitle>
                          </div>
                          <CardDescription className="text-gray-400">
                            {healerClasses.includes(className) ? "Healer" : "DPS"}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-gray-400">
                                {healerClasses.includes(className) ? "HPS Médio" : "DPS Médio"}
                              </span>
                              <span className="text-sm font-medium text-yellow-500">
                                {stats.avgDps.toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-400">
                                  {healerClasses.includes(className) ? "HPS Máximo" : "DPS Máximo"}
                                </span>
                                <span className="text-sm font-medium text-yellow-500">
                                  {stats.maxDps.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-400">Nota Média</span>
                                <span className="text-sm font-medium text-yellow-500">{stats.avgRating}</span>
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm text-gray-400">Participações</span>
                                <span className="text-sm font-medium text-yellow-500">{stats.count}</span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2">
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-gray-400">Ranking</span>
                              <span className="text-sm font-medium text-yellow-500">
                                {stats.rank > 0 ? `#${stats.rank}` : "-"}
                              </span>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-gray-400">Percentil</span>
                              <span className="text-sm font-medium text-yellow-500">{stats.percentile}%</span>
                            </div>
                            <Progress
                              value={stats.percentile}
                              className="h-2 mt-1 bg-gray-800"
                              indicatorClassName="bg-yellow-500"
                            />
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                          <div className="text-xs text-gray-500">
                            {stats.percentile >= 90 ? (
                              <div className="flex items-center gap-1 text-green-400">
                                <Award className="h-3 w-3" />
                                <span>Desempenho excepcional</span>
                              </div>
                            ) : stats.percentile >= 70 ? (
                              <div className="flex items-center gap-1 text-blue-400">
                                <Activity className="h-3 w-3" />
                                <span>Acima da média</span>
                              </div>
                            ) : stats.percentile >= 50 ? (
                              <div className="flex items-center gap-1 text-yellow-400">
                                <ArrowUpDown className="h-3 w-3" />
                                <span>Na média</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-gray-400">
                                <User className="h-3 w-3" />
                                <span>Em desenvolvimento</span>
                              </div>
                            )}
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Cards com resumo */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="bg-gray-900 border-yellow-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total de Jogadores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">{totalPlayers}</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-yellow-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Média de DPS/HPS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-500">{avgDps}</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-yellow-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total de DPS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{totalDpsers}</div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-yellow-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total de Healers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{totalHealers}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="classes" className="mt-6">
            <TabsList className="bg-gray-900 border border-yellow-900">
              <TabsTrigger value="classes" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black">
                <BarChart className="mr-2 h-4 w-4" />
                Distribuição de Classes
              </TabsTrigger>
              <TabsTrigger
                value="evolution"
                className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black"
              >
                <LineChart className="mr-2 h-4 w-4" />
                Evolução de Desempenho
              </TabsTrigger>
            </TabsList>

            <TabsContent value="classes" className="mt-6">
              <Card className="bg-gray-900 border-yellow-900">
                <CardHeader className="px-6 py-4 border-b border-yellow-900/50">
                  <CardTitle className="text-yellow-500">Distribuição de Classes</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div>
                    {classStats.map((stat, index) => (
                      <div key={stat.class} className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-300">{stat.class}</span>
                          <span className="text-yellow-500">
                            {stat.count} ({stat.percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2.5">
                          <div
                            className={`${chartColors[index % chartColors.length]} h-2.5 rounded-full`}
                            style={{ width: `${stat.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {classStats.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      Nenhum dado disponível para exibir estatísticas de classes.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evolution" className="mt-6">
              <Card className="bg-gray-900 border-yellow-900">
                <CardHeader className="px-6 py-4 border-b border-yellow-900/50">
                  <CardTitle className="text-yellow-500">Evolução de Desempenho</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center text-gray-500 py-8">Gráfico de evolução estará disponível em breve.</div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="border-t border-yellow-900/50 bg-black">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} INFERNUS CAÇADAS. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <a href="#" className="hover:text-yellow-500 hover:underline">
              Termos
            </a>
            <a href="#" className="hover:text-yellow-500 hover:underline">
              Privacidade
            </a>
            <Link href={`/admin/login?t=${timestamp}`} className="hover:text-yellow-500 hover:underline">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

