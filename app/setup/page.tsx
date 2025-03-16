"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SetupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const initializeDatabase = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setResult(null)

      const response = await fetch("/api/init-database")
      const data = await response.json()

      if (data.success) {
        setResult("Banco de dados inicializado com sucesso!")
      } else {
        throw new Error(data.error || "Falha ao inicializar banco de dados")
      }
    } catch (err) {
      console.error("Erro:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setIsLoading(false)
    }
  }

  const testConnection = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setResult(null)

      const response = await fetch("/api/test-connection")
      const data = await response.json()

      if (data.success) {
        setResult(`Conexão estabelecida com sucesso! Jogadores encontrados: ${data.playerCount}`)
      } else {
        throw new Error(data.error || "Falha ao testar conexão")
      }
    } catch (err) {
      console.error("Erro:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-gray-900 p-6 rounded-lg border border-yellow-900/50">
        <h1 className="text-2xl font-bold text-yellow-500 mb-6 text-center">Configuração do Sistema</h1>

        <div className="space-y-4">
          <Button onClick={testConnection} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
            {isLoading ? "Processando..." : "Testar Conexão"}
          </Button>

          <Button onClick={initializeDatabase} disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700">
            {isLoading ? "Processando..." : "Inicializar Banco de Dados"}
          </Button>

          {result && (
            <div className="p-3 bg-green-900/50 border border-green-800 rounded-md text-sm text-green-200">
              {result}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-900/50 border border-red-800 rounded-md text-sm text-red-200">{error}</div>
          )}

          <div className="pt-4 border-t border-gray-800 mt-4">
            <Link href="/">
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700">Voltar para o Início</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

