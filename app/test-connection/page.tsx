"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function TestConnectionPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testConnection = async (direct = false) => {
    try {
      setIsLoading(true)
      setError(null)
      setResult(null)

      const response = await fetch(`/api/test-atlas-connection?direct=${direct}`)
      const data = await response.json()

      if (data.success) {
        setResult(data)
      } else {
        throw new Error(data.error || "Falha ao testar conexão")
      }
    } catch (err) {
      console.error("Erro ao testar conexão:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido ao testar conexão")
    } finally {
      setIsLoading(false)
    }
  }

  // Testar conexão automaticamente ao carregar a página
  useEffect(() => {
    testConnection()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-yellow-500 mb-6">Teste de Conexão com MongoDB Atlas</h1>

        <div className="grid gap-4 mb-6">
          <button
            onClick={() => testConnection(false)}
            disabled={isLoading}
            className="p-3 bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            {isLoading ? "Testando..." : "Testar Conexão Padrão"}
          </button>

          <button
            onClick={() => testConnection(true)}
            disabled={isLoading}
            className="p-3 bg-green-600 hover:bg-green-700 rounded-md"
          >
            {isLoading ? "Testando..." : "Testar Conexão Direta"}
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
            <h3 className="text-lg font-medium text-green-500 mb-2">Conexão bem-sucedida!</h3>
            <div className="mb-4">
              <p className="text-gray-300">Coleções encontradas: {result.collections.length}</p>
              <p className="text-gray-300">Timestamp: {new Date(result.timestamp).toLocaleString()}</p>
            </div>
            <h4 className="text-md font-medium text-yellow-500 mb-2">Detalhes:</h4>
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

