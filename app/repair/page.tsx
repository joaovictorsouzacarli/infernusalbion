"use client"

import { useState } from "react"
import Link from "next/link"

export default function RepairPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const runAction = async (action: string) => {
    try {
      setIsLoading(true)
      setError(null)
      setResult(null)

      const response = await fetch(`/api/db-repair?mode=${action}`)
      const data = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        throw new Error(data.error || `Falha ao executar ${action}`)
      }
    } catch (err) {
      console.error(`Erro ao executar ${action}:`, err)
      setError(err instanceof Error ? err.message : `Erro desconhecido ao executar ${action}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-yellow-500 mb-6">Reparo de Emergência do Banco de Dados</h1>

        <div className="grid gap-4 mb-6">
          <button
            onClick={() => runAction("diagnose")}
            disabled={isLoading}
            className="p-3 bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            {isLoading ? "Carregando..." : "1. Diagnosticar Banco de Dados"}
          </button>

          <button
            onClick={() => runAction("fix")}
            disabled={isLoading}
            className="p-3 bg-green-600 hover:bg-green-700 rounded-md"
          >
            {isLoading ? "Carregando..." : "2. Corrigir Dados Inválidos"}
          </button>

          <button
            onClick={() => runAction("recalculate")}
            disabled={isLoading}
            className="p-3 bg-orange-600 hover:bg-orange-700 rounded-md"
          >
            {isLoading ? "Carregando..." : "3. Recalcular Médias"}
          </button>

          <button
            onClick={() => runAction("reset")}
            disabled={isLoading}
            className="p-3 bg-red-600 hover:bg-red-700 rounded-md"
          >
            {isLoading ? "Carregando..." : "4. RESET COMPLETO (Apaga tudo e insere dados de exemplo)"}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-900/50 border border-red-800 rounded-md mb-4">
            <h3 className="text-lg font-medium text-red-300 mb-2">Erro:</h3>
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {result && (
          <div className="p-4 bg-gray-800 rounded-md">
            <h3 className="text-lg font-medium text-yellow-500 mb-2">Resultado:</h3>
            <pre className="text-xs text-gray-300 overflow-auto max-h-96 p-2 bg-black/50 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 flex gap-4">
          <Link href="/" className="p-2 bg-yellow-600 hover:bg-yellow-700 rounded-md">
            Voltar para o Início
          </Link>

          <Link href="/admin/login" className="p-2 bg-yellow-600 hover:bg-yellow-700 rounded-md">
            Ir para Login
          </Link>
        </div>
      </div>
    </div>
  )
}

