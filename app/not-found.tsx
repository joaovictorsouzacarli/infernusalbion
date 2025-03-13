import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <Search className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-yellow-500 mb-2">Página não encontrada</h1>
        <p className="text-gray-400 mb-6">A página que você está procurando não existe ou foi movida.</p>
        <Link href="/">
          <Button className="bg-yellow-600 hover:bg-yellow-700 text-black">Voltar para o início</Button>
        </Link>
      </div>
    </div>
  )
}

