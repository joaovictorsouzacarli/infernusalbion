import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-yellow-600">
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
          <div className="flex items-center gap-4">
            <Link href="/admin/login">
              <Button variant="outline" className="border-yellow-600 text-yellow-500">
                Área Administrativa
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-yellow-500 mb-4">Bem-vindo ao Sistema de Ranking DPS</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Acompanhe as estatísticas de DPS e HPS dos jogadores da INFERNUS nas caçadas. Veja rankings, compare
            performances e acompanhe o progresso da guilda.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-gray-900 border border-yellow-900 rounded-lg p-6">
            <h3 className="text-xl font-bold text-yellow-500 mb-2">Estatísticas</h3>
            <p className="text-gray-400 mb-4">Visualize estatísticas detalhadas de DPS/HPS por classe e jogador.</p>
            <Link href="/estatisticas">
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-black">Ver Estatísticas</Button>
            </Link>
          </div>

          <div className="bg-gray-900 border border-yellow-900 rounded-lg p-6">
            <h3 className="text-xl font-bold text-yellow-500 mb-2">Rankings</h3>
            <p className="text-gray-400 mb-4">Confira os melhores jogadores em diferentes categorias e classes.</p>
            <Link href="/rankings">
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-black">Ver Rankings</Button>
            </Link>
          </div>

          <div className="bg-gray-900 border border-yellow-900 rounded-lg p-6">
            <h3 className="text-xl font-bold text-yellow-500 mb-2">Histórico</h3>
            <p className="text-gray-400 mb-4">Acesse o histórico completo de caçadas e performances.</p>
            <Link href="/historico">
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-black">Ver Histórico</Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-yellow-900/50 bg-black mt-auto">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} INFERNUS CAÇADAS. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}

