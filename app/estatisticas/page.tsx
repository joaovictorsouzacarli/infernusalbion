import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export default function EstatisticasPage({
  searchParams,
}: {
  searchParams: { tab?: string }
}) {
  const activeTab = searchParams.tab === "hps" ? "hps" : "dps"

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
        <div className="container py-10 flex flex-col items-center">
          <div className="flex w-full max-w-5xl items-center mb-6">
            <Link href="/">
              <Button variant="outline" size="sm" className="border-yellow-600 text-yellow-500">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
            <h2 className="text-3xl font-bold text-yellow-500 mx-auto">Estatísticas Detalhadas</h2>
          </div>

          <div className="w-full max-w-5xl mb-6">
            <div className="grid grid-cols-2 w-full bg-gray-900 rounded-lg mb-6">
              <Link
                href="/estatisticas"
                className={`text-center py-2 text-yellow-500 ${activeTab === "dps" ? "bg-yellow-600/20 font-medium" : "hover:bg-yellow-600/10"}`}
              >
                DPS
              </Link>
              <Link
                href="/estatisticas?tab=hps"
                className={`text-center py-2 text-yellow-500 ${activeTab === "hps" ? "bg-yellow-600/20 font-medium" : "hover:bg-yellow-600/10"}`}
              >
                HPS
              </Link>
            </div>

            {activeTab === "dps" ? (
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-gray-900 border-yellow-900/50">
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

                <Card className="bg-gray-900 border-yellow-900/50">
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
            ) : (
              <div className="grid gap-6 md:grid-cols-1 max-w-lg mx-auto">
                <Card className="bg-gray-900 border-yellow-900/50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-yellow-500 mb-4">Healers</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center text-black font-bold">
                            1
                          </div>
                          <span className="font-medium">Healer1</span>
                        </div>
                        <span className="text-yellow-500 font-bold">1200 HPS</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-black font-bold">
                            2
                          </div>
                          <span className="font-medium">Healer2</span>
                        </div>
                        <span className="text-yellow-500 font-bold">1100 HPS</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-yellow-900 flex items-center justify-center text-black font-bold">
                            3
                          </div>
                          <span className="font-medium">Healer3</span>
                        </div>
                        <span className="text-yellow-500 font-bold">1000 HPS</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
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

