import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Medal } from "lucide-react"
import { SiteHeader } from "@/components/site-header"

// Função para obter os jogadores do servidor
async function getPlayers() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/players`, {
      cache: "no-store",
      next: { revalidate: 60 }, // Revalidar a cada 60 segundos
    })

    if (!res.ok) {
      throw new Error("Falha ao carregar jogadores")
    }

    return res.json()
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

  return (
    <div className="flex min-h-screen flex-col bg-black/95 text-white relative">
      <SiteHeader />

      <main className="flex-1 relative">
        <div className="container py-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-yellow-500">Ranking de Jogadores</h2>
            <p className="text-gray-400 mt-2">Confira o desempenho dos jogadores da INFERNUS nas caçadas</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 mb-10">
            {/* Seção de DPS */}
            <Card className="bg-gray-900 border-yellow-900/50">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-yellow-500 mb-4 flex items-center">
                  <span className="bg-yellow-600/20 px-3 py-1 rounded-md">Ranking de DPS</span>
                </h3>
                <div className="space-y-4">
                  {dpsPlayers.length > 0 ? (
                    dpsPlayers.map((player, index) => (
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
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-yellow-500 mb-4 flex items-center">
                  <span className="bg-yellow-600/20 px-3 py-1 rounded-md">Ranking de HPS</span>
                </h3>
                <div className="space-y-4">
                  {hpsPlayers.length > 0 ? (
                    hpsPlayers.map((player, index) => (
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
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-black">Ver estatísticas detalhadas</Button>
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
    </div>
  )
}

