import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
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
        <div className="container py-6 md:py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-yellow-500">Ranking de DPS/HPS</h2>
            <p className="text-gray-400 mt-2">Confira o desempenho dos jogadores da INFERNUS nas caçadas</p>
          </div>

          <div className="mb-6">
            <div className="grid grid-cols-2 w-full bg-gray-900 rounded-lg mb-6">
              <div className="text-center py-2 text-yellow-500 bg-yellow-600/20 font-medium">DPS</div>
              <Link href="/hps" className="text-center py-2 text-yellow-500 hover:bg-yellow-600/10">
                HPS
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="bg-gray-900 border-yellow-900">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-yellow-500 mb-4">Tanques</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center text-black font-bold">
                          1
                        </div>
                        <span className="font-medium">Jogador1</span>
                      </div>
                      <span className="text-yellow-500 font-bold">1200 DPS</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-black font-bold">
                          2
                        </div>
                        <span className="font-medium">Jogador2</span>
                      </div>
                      <span className="text-yellow-500 font-bold">1100 DPS</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-yellow-900 flex items-center justify-center text-black font-bold">
                          3
                        </div>
                        <span className="font-medium">Jogador3</span>
                      </div>
                      <span className="text-yellow-500 font-bold">1000 DPS</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-yellow-900">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-yellow-500 mb-4">DPS Melee</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center text-black font-bold">
                          1
                        </div>
                        <span className="font-medium">Jogador4</span>
                      </div>
                      <span className="text-yellow-500 font-bold">1800 DPS</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-black font-bold">
                          2
                        </div>
                        <span className="font-medium">Jogador5</span>
                      </div>
                      <span className="text-yellow-500 font-bold">1700 DPS</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-yellow-900 flex items-center justify-center text-black font-bold">
                          3
                        </div>
                        <span className="font-medium">Jogador6</span>
                      </div>
                      <span className="text-yellow-500 font-bold">1600 DPS</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-yellow-900">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-yellow-500 mb-4">DPS Ranged</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center text-black font-bold">
                          1
                        </div>
                        <span className="font-medium">Jogador7</span>
                      </div>
                      <span className="text-yellow-500 font-bold">1500 DPS</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-black font-bold">
                          2
                        </div>
                        <span className="font-medium">Jogador8</span>
                      </div>
                      <span className="text-yellow-500 font-bold">1400 DPS</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-yellow-900 flex items-center justify-center text-black font-bold">
                          3
                        </div>
                        <span className="font-medium">Jogador9</span>
                      </div>
                      <span className="text-yellow-500 font-bold">1300 DPS</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 flex justify-center">
              <Link href="/estatisticas">
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

