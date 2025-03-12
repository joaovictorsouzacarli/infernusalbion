"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-yellow-500 mb-4">Algo deu errado!</h2>
        <p className="text-gray-400 mb-6">
          Ocorreu um erro ao carregar esta página. Tente novamente ou volte para a página inicial.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => reset()} className="bg-yellow-600 hover:bg-yellow-700 text-black">
            Tentar novamente
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="border-yellow-600 text-yellow-500"
          >
            Voltar para o início
          </Button>
        </div>
      </div>
    </div>
  )
}

