import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Medal } from "lucide-react"

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

export default async function HpsPage() {
  const players = await getPlayers()

  // Filtrar apenas healers e ordenar por HPS
  const healers = players
    .filter((player) => player.isHealer)
    .sort((a, b) => Number.parseInt(b.avgDps) - Number.parseInt(a.avgDps))

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="border-b border-yellow-600">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" width={40} height={40} alt="Infernus Logo" className="rounded-md" />
            <h1 className="text-xl font-bold text-yellow-500">INFERNUS CAÇADAS</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin/login">
              <Button variant="outline" className="border-yellow-600 text-yellow-500">
                Área Administrativa
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-yellow-500">Ranking de Healers</h2>
            <p className="text-gray-400 mt-2">Confira o desempenho dos healers da INFERNUS nas caçadas</p>
          </div>

          <div className="mb-6">
            <div className="grid grid-cols-2 w-full max-w-md mx-auto bg-gray-900 rounded-lg mb-6">
              <Link href="/" className="text-center py-2 text-yellow-500 hover:bg-yellow-600/10">
                DPS
              </Link>
              <div className="text-center py-2 text-yellow-500 bg-yellow-600/20 font-medium">HPS</div>
            </div>

            <Card className="bg-gray-900 border-yellow-900/50 max-w-2xl mx-auto">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-yellow-500 mb-4 flex items-center">
                  <span className="bg-yellow-600/20 px-3 py-1 rounded-md">Ranking de HPS</span>
                </h3>
                <div className="space-y-4">
                  {healers.length > 0 ? (
                    healers.map((player, index) => (
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
                    <div className="text-center text-gray-500 py-4">Nenhum healer encontrado</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <Link href="/estatisticas?tab=hps">
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-black">Ver estatísticas detalhadas</Button>
              </Link>
            </div>
          </div>
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

