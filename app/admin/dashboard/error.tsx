"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to the console
    console.error("Erro no painel administrativo:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-yellow-500 mb-2">Algo deu errado!</h1>
        <p className="text-gray-400 mb-6">
          Ocorreu um erro ao carregar o painel administrativo. Isso pode ser devido a um problema com os dados ou com a
          conexão ao banco de dados.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} className="bg-yellow-600 hover:bg-yellow-700 text-black">
            Tentar novamente
          </Button>
          <Link href="/">
            <Button variant="outline" className="border-yellow-600 text-yellow-500">
              Voltar para o início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

