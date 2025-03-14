import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Medal, BarChart3, TrendingUp, Users, Search } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { DebugInfo } from "@/components/debug-info"

// Função para obter os jogadores do servidor
async function getPlayers() {
  try {
    // Adicionando um timestamp para evitar cache
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/players?t=${Date.now()}`, {
      cache: "no-store",
      next: { revalidate: 0 }, // Desabilitando o cache completamente
    })

    if (!res.ok) {
      throw new Error("Falha ao carregar jogadores")
    }

    const data = await res.json()
    console.log(`Página inicial: Recebidos ${data.length} jogadores da API`)
    return data
  } catch (error) {
    console.error("Erro ao buscar jogadores:", error)
    return []
  }
}

export default async function Home() {
  const players = await getPlayers()

  // Separar jogadores por tipo (DPS e HPS)
  const dpsPlayers = players
    .filter((player) => !player.isHealer)
    .sort((a, b) => Number.parseInt(b.avgDps) - Number.parseInt(a.avgDps))

  const hpsPlayers = players
    .filter((player) => player.isHealer)
    .sort((a, b) => Number.parseInt(b.avgDps) - Number.parseInt(a.avgDps))

  // Agrupar jogadores por classe para estatísticas
  const classCounts = players.reduce((acc, player) => {
    acc[player.class] = (acc[player.class] || 0) + 1
    return acc
  }, {})

  // Encontrar o jogador com maior DPS e HPS
  const topDps = dpsPlayers.length > 0 ? dpsPlayers[0] : null
  const topHps = hpsPlayers.length > 0 ? hpsPlayers[0] : null

  // Calcular médias gerais
  const avgDpsValue =
    dpsPlayers.length > 0 ? Math.round(dpsPlayers.reduce((sum, p) => sum + Number(p.avgDps), 0) / dpsPlayers.length) : 0

  const avgHpsValue =
    hpsPlayers.length > 0 ? Math.round(hpsPlayers.reduce((sum, p) => sum + Number(p.avgDps), 0) / hpsPlayers.length) : 0

  return (
    <div className="flex min-h-screen flex-col bg-black/95 text-white relative">
      <SiteHeader />

      <main className="flex-1 relative">
        <div className="container py-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-yellow-500">INFERNUS CAÇADAS</h2>
            <p className="text-gray-400 mt-2">Sistema de Ranking e Estatísticas de DPS/HPS</p>
          </div>

          {/* Cards de estatísticas gerais */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="bg-gray-900 border-yellow-900/50">
              <CardContent className="p-4 flex items-center">
                <div className="bg-yellow-600/20 p-3 rounded-full mr-4">
                  <Users className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Total de Jogadores</p>
                  <h3 className="text-2xl font-bold text-white">{players.length}</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-yellow-900/50">
              <CardContent className="p-4 flex items-center">
                <div className="bg-yellow-600/20 p-3 rounded-full mr-4">
                  <TrendingUp className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Média de DPS</p>
                  <h3 className="text-2xl font-bold text-white">{avgDpsValue}</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-yellow-900/50">
              <CardContent className="p-4 flex items-center">
                <div className="bg-yellow-600/20 p-3 rounded-full mr-4">
                  <TrendingUp className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Média de HPS</p>
                  <h3 className="text-2xl font-bold text-white">{avgHpsValue}</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-yellow-900/50">
              <CardContent className="p-4 flex items-center">
                <div className="bg-yellow-600/20 p-3 rounded-full mr-4">
                  <BarChart3 className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Classes Diferentes</p>
                  <h3 className="text-2xl font-bold text-white">{Object.keys(classCounts).length}</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Destaque para os melhores jogadores */}
          <div className="grid gap-6 md:grid-cols-2 mb-10">
            {topDps && (
              <Card className="bg-gray-900 border-yellow-900/50 overflow-hidden">
                <CardHeader className="bg-yellow-600/10 pb-2">
                  <CardTitle className="text-yellow-500 flex items-center">
                    <Medal className="mr-2 h-5 w-5 text-yellow-400" />
                    Melhor DPS
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">{topDps.name}</h3>
                      <p className="text-sm text-gray-400">{topDps.class}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-yellow-500">{topDps.avgDps}</div>
                      <p className="text-sm text-gray-400">DPS Médio</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">DPS Máximo</p>
                      <p className="font-medium text-white">{topDps.maxDps}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Nota</p>
                      <p className="font-medium text-white">{topDps.avgRating}</p>
                    </div>
                    <Link href={`/estatisticas?player=${topDps.name}`}>
                      <Button variant="outline" size="sm" className="border-yellow-600 text-yellow-500">
                        Ver detalhes
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}

            {topHps && (
              <Card className="bg-gray-900 border-yellow-900/50 overflow-hidden">
                <CardHeader className="bg-yellow-600/10 pb-2">
                  <CardTitle className="text-yellow-500 flex items-center">
                    <Medal className="mr-2 h-5 w-5 text-yellow-400" />
                    Melhor HPS
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">{topHps.name}</h3>
                      <p className="text-sm text-gray-400">{topHps.class}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-yellow-500">{topHps.avgDps}</div>
                      <p className="text-sm text-gray-400">HPS Médio</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-400">HPS Máximo</p>
                      <p className="font-medium text-white">{topHps.maxDps}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Nota</p>
                      <p className="font-medium text-white">{topHps.avgRating}</p>
                    </div>
                    <Link href={`/estatisticas?player=${topHps.name}`}>
                      <Button variant="outline" size="sm" className="border-yellow-600 text-yellow-500">
                        Ver detalhes
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="grid gap-8 md:grid-cols-2 mb-10">
            {/* Seção de DPS */}
            <Card className="bg-gray-900 border-yellow-900/50">
              <CardHeader className="bg-yellow-600/10 pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-yellow-500">Ranking de DPS</CardTitle>
                <Link href="/estatisticas?tab=dps">
                  <Button variant="ghost" size="sm" className="text-yellow-500 hover:bg-yellow-600/20">
                    Ver todos
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {dpsPlayers.length > 0 ? (
                    dpsPlayers.slice(0, 5).map((player, index) => (
                      <div
                        key={player.id || player._id}
                        className="flex items-center justify-between border-b border-gray-800 pb-3 last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          {index === 0 && (
                            <div className="text-yellow-400">
                              <Medal size={24} />
                            </div>
                          )}
                          {index === 1 && (
                            <div className="text-gray-400">
                              <Medal size={24} />
                            </div>
                          )}
                          {index === 2 && (
                            <div className="text-amber-700">
                              <Medal size={24} />
                            </div>
                          )}
                          {index > 2 && (
                            <div className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">
                              {index + 1}
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{player.name}</div>
                            <div className="text-xs text-gray-400">{player.class}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-yellow-500 font-bold">{player.avgDps} DPS</div>
                          <div className="text-xs text-gray-400">Nota: {player.avgRating}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-4">Nenhum jogador DPS encontrado</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Seção de HPS */}
            <Card className="bg-gray-900 border-yellow-900/50">
              <CardHeader className="bg-yellow-600/10 pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-yellow-500">Ranking de HPS</CardTitle>
                <Link href="/estatisticas?tab=hps">
                  <Button variant="ghost" size="sm" className="text-yellow-500 hover:bg-yellow-600/20">
                    Ver todos
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {hpsPlayers.length > 0 ? (
                    hpsPlayers.slice(0, 5).map((player, index) => (
                      <div
                        key={player.id || player._id}
                        className="flex items-center justify-between border-b border-gray-800 pb-3 last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          {index === 0 && (
                            <div className="text-yellow-400">
                              <Medal size={24} />
                            </div>
                          )}
                          {index === 1 && (
                            <div className="text-gray-400">
                              <Medal size={24} />
                            </div>
                          )}
                          {index === 2 && (
                            <div className="text-amber-700">
                              <Medal size={24} />
                            </div>
                          )}
                          {index > 2 && (
                            <div className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">
                              {index + 1}
                            </div>
                          )}
                          <div>
                            <div className="font-medium">{player.name}</div>
                            <div className="text-xs text-gray-400">{player.class}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-yellow-500 font-bold">{player.avgDps} HPS</div>
                          <div className="text-xs text-gray-400">Nota: {player.avgRating}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-4">Nenhum jogador Healer encontrado</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Link href="/estatisticas">
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-black">
                <Search className="mr-2 h-4 w-4" />
                Buscar e comparar jogadores
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-yellow-900/50 bg-black/80 relative">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} INFERNUS CAÇADAS. Todos os direitos reservados.
          </p>
        </div>
      </footer>
      <DebugInfo
        data={{
          totalPlayers: players.length,
          dpsPlayers: dpsPlayers.length,
          hpsPlayers: hpsPlayers.length,
          players: players.map((p) => ({
            id: p.id || p._id,
            name: p.name,
            class: p.class,
            avgDps: p.avgDps,
            isHealer: p.isHealer,
          })),
        }}
      />
    </div>
  )
}

