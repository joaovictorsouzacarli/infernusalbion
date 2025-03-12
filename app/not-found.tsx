import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-yellow-500 mb-4">Página não encontrada</h2>
        <p className="text-gray-400 mb-6">Desculpe, a página que você está procurando não existe ou foi movida.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-yellow-600 hover:bg-yellow-700 text-black">
            <Link href="/">Voltar para o início</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

