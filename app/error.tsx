"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log detalhado do erro
    console.error("Erro detalhado:", error)
    console.error("Stack trace:", error.stack)
    console.error("Digest:", error.digest)
  }, [error])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-yellow-500 mb-2">Algo deu errado!</h1>
        <p className="text-gray-400 mb-6">
          Ocorreu um erro ao carregar esta página. Tente novamente ou use as opções de reparo.
        </p>

        <div className="mb-6 p-4 bg-gray-900 rounded-md text-left">
          <h3 className="text-sm font-medium text-yellow-500 mb-2">Detalhes do erro:</h3>
          <p className="text-xs text-red-400 mb-2">{error.message}</p>
          {error.digest && <p className="text-xs text-gray-500">Código do erro: {error.digest}</p>}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset} className="bg-yellow-600 hover:bg-yellow-700 text-black">
            Tentar novamente
          </Button>

          <Link href="/repair">
            <Button variant="outline" className="border-yellow-600 text-yellow-500">
              Reparar Banco de Dados
            </Button>
          </Link>

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

