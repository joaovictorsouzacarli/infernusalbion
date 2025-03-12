"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Player } from "@/lib/db"

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

export default function InfernusCacadas() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const timestamp = Date.now()

  // Estados
  const [rankingPlayers, setRankingPlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchText, setSearchText] = useState("")
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([])
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<number>(0)

  // Função para buscar dados
  const fetchData = async () => {
    try {
      setIsLoading(true)

      // Buscar jogadores da API com um timestamp para evitar cache
      const response = await fetch(`/api/players?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      })

      if (response.ok) {
        const data = await response.json()
        setRankingPlayers(data)
        setFilteredPlayers(data)

        // Obter o último timestamp de atualização
        const lastModified = response.headers.get("Last-Modified")
        if (lastModified) {
          setLastUpdate(new Date(lastModified).getTime())
        }
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

  // Buscar dados iniciais
  useEffect(() => {
    fetchData()
  }, [])

  // Verificar se há atualizações a cada 5 segundos
  useEffect(() => {
    const checkUpdates = async () => {
      try {
        const response = await fetch("/api/admin/refresh-cache")
        if (response.ok) {
          const data = await response.json()
          if (data.lastUpdate > lastUpdate) {
            fetchData()
          }
        }
      } catch (error) {
        console.error("Erro ao verificar atualizações:", error)
      }
    }

    const intervalId = setInterval(checkUpdates, 5000)
    return () => clearInterval(intervalId)
  }, [lastUpdate])

  // Filtrar jogadores quando o texto de busca mudar
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredPlayers(rankingPlayers)
      return
    }

    const filtered = rankingPlayers.filter(
      (player) =>
        player.name.toLowerCase().includes(searchText.toLowerCase()) ||
        player.class.toLowerCase().includes(searchText.toLowerCase()),
    )

    setFilteredPlayers(filtered)
  }, [searchText, rankingPlayers])

  // Monitorar eventos de armazenamento
  useEffect(() => {
    const handleStorageChange = () => {
      fetchData()
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // O filtro já é aplicado pelo useEffect
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="mb-4 text-yellow-500 text-xl">Carregando...</div>
          <div className="text-gray-400 text-sm">Aguarde enquanto os dados são carregados</div>
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
            <Link href={`/?t=${timestamp}`} className="text-sm font-medium text-yellow-500">
              Rankings
            </Link>
            <Link
              href={`/estatisticas?t=${timestamp}`}
              className="text-sm font-medium text-gray-400 hover:text-yellow-500"
            >
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
      <div className="relative w-full h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10"></div>
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SWAP_4.png-1E01OYWrRQZhycLojFhDgjHeUCjw8l.jpeg"
          fill
          alt="Infernus Background"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center"></div>
        </div>
      </div>
      <main className="flex-1">
        <div className="container py-6 md:py-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-yellow-500">Ranking de Desempenho</h2>
              <p className="text-gray-400">Veja os melhores jogadores classificados por dano ou cura por segundo</p>
            </div>
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Buscar jogador..."
                  className="w-full rounded-md pl-8 md:w-[200px] lg:w-[300px] bg-gray-900 border-gray-700 text-white"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <Button type="submit" className="bg-yellow-600 hover:bg-yellow-700 text-black">
                Buscar
              </Button>
            </form>
          </div>
          <Tabs defaultValue="all" className="mt-6">
            <TabsList className="bg-gray-900 border border-yellow-900">
              <TabsTrigger value="all" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black">
                Todos
              </TabsTrigger>
              <TabsTrigger value="weekly" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black">
                Semanal
              </TabsTrigger>
              <TabsTrigger value="monthly" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black">
                Mensal
              </TabsTrigger>
              <TabsTrigger value="season" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-black">
                Temporada
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <Card className="bg-gray-900 border-yellow-900">
                <CardHeader className="px-6 py-4 border-b border-yellow-900/50">
                  <CardTitle className="text-yellow-500">Ranking Geral de Desempenho</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-yellow-900/50 bg-black/50 text-sm">
                          <th className="px-6 py-3 text-left font-medium text-gray-400">Posição</th>
                          <th className="px-6 py-3 text-left font-medium text-gray-400">Jogador</th>
                          <th className="px-6 py-3 text-left font-medium text-gray-400">Classe</th>
                          <th className="px-6 py-3 text-left font-medium text-gray-400">Função</th>
                          <th className="px-6 py-3 text-left font-medium text-gray-400">Valor Médio</th>
                          <th className="px-6 py-3 text-left font-medium text-gray-400">Valor Máximo</th>
                          <th className="px-6 py-3 text-left font-medium text-gray-400">Nota</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPlayers.length > 0 ? (
                          filteredPlayers.map((player, index) => {
                            // Verificar se o jogador é um healer
                            const isHealer = healerClasses.includes(player.class)

                            return (
                              <tr key={player._id} className="border-b border-yellow-900/30 hover:bg-black/40">
                                <td className="px-6 py-4 text-sm">
                                  <div className="flex items-center gap-2">
                                    <span className={`font-bold ${index < 3 ? "text-yellow-500" : "text-gray-300"}`}>
                                      #{index + 1}
                                    </span>
                                    {index < 3 && (
                                      <span className="text-lg">{index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                  <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-yellow-900/50 flex items-center justify-center overflow-hidden">
                                      <Image
                                        src={`/placeholder.svg?height=32&width=32&text=${player.name.charAt(0)}`}
                                        width={32}
                                        height={32}
                                        alt={player.name}
                                      />
                                    </div>
                                    <div>
                                      <div className="font-medium text-white">{player.name}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                  <div className="flex items-center gap-2">
                                    <div className="h-6 w-6">
                                      <Image
                                        src={
                                          classIcons[player.class] ||
                                          `/placeholder.svg?height=24&width=24&text=${player.class.charAt(0) || "/placeholder.svg"}`
                                        }
                                        width={24}
                                        height={24}
                                        alt={player.class}
                                        className="rounded bg-yellow-900/50"
                                      />
                                    </div>
                                    <span className="text-gray-300">{player.class}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-sm">
                                  {isHealer ? (
                                    <span className="px-2 py-1 bg-green-900/30 text-green-400 rounded-full text-xs">
                                      Healer
                                    </span>
                                  ) : (
                                    <span className="px-2 py-1 bg-red-900/30 text-red-400 rounded-full text-xs">
                                      DPS
                                    </span>
                                  )}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-yellow-500">
                                  {player.avgDps} {isHealer ? "HPS" : "DPS"}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-yellow-500">
                                  {player.maxDps} {isHealer ? "HPS" : "DPS"}
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-yellow-500">
                                  {player.avgRating || "0"}
                                </td>
                              </tr>
                            )
                          })
                        ) : (
                          <tr>
                            <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                              Nenhum jogador encontrado no ranking.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="weekly" className="mt-6">
              <Card className="bg-gray-900 border-yellow-900">
                <CardHeader className="px-6 py-4 border-b border-yellow-900/50">
                  <CardTitle className="text-yellow-500">Ranking Semanal de Desempenho</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex items-center justify-center p-6 text-gray-500">
                    Dados semanais serão carregados aqui
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="monthly" className="mt-6">
              <Card className="bg-gray-900 border-yellow-900">
                <CardHeader className="px-6 py-4 border-b border-yellow-900/50">
                  <CardTitle className="text-yellow-500">Ranking Mensal de Desempenho</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex items-center justify-center p-6 text-gray-500">
                    Dados mensais serão carregados aqui
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="season" className="mt-6">
              <Card className="bg-gray-900 border-yellow-900">
                <CardHeader className="px-6 py-4 border-b border-yellow-900/50">
                  <CardTitle className="text-yellow-500">Ranking da Temporada de Desempenho</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="flex items-center justify-center p-6 text-gray-500">
                    Dados da temporada serão carregados aqui
                  </div>
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

