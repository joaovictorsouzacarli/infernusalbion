"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, RefreshCw, Check, ArrowLeft, Bug } from "lucide-react"

export default function DiagnosticoDetalhadoPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [action, setAction] = useState<string | null>(null)
  const [envVars, setEnvVars] = useState<any>(null)

  // Verificar variáveis de ambiente
  const checkEnvVars = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setStatus("Verificando variáveis de ambiente...")
      setAction("env")

      const response = await fetch(`/api/check-env`)
      const data = await response.json()

      if (data.success) {
        setStatus(`Verificação de variáveis de ambiente concluída!`)
        setEnvVars(data)
      } else {
        throw new Error(data.error || `Falha ao verificar variáveis de ambiente`)
      }
    } catch (err) {
      console.error(`Erro ao verificar variáveis de ambiente:`, err)
      setError(err instanceof Error ? err.message : `Erro desconhecido ao verificar variáveis de ambiente`)
      setStatus(null)
    } finally {
      setIsLoading(false)
    }
  }

  const testConnection = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setStatus(`Testando conexão com o banco de dados...`)
      setAction("connection")

      const response = await fetch(`/api/test-connection-detailed`)
      const data = await response.json()

      if (data.success) {
        setStatus(`Teste de conexão concluído com sucesso!`)
        setResult(data)
      } else {
        throw new Error(data.error || `Falha ao testar conexão`)
      }
    } catch (err) {
      console.error(`Erro ao testar conexão:`, err)
      setError(err instanceof Error ? err.message : `Erro desconhecido ao testar conexão`)
      setStatus(null)
    } finally {
      setIsLoading(false)
    }
  }

  const initializeDatabase = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setStatus(`Inicializando banco de dados...`)
      setAction("init")

      const response = await fetch(`/api/init-database?force=true`)
      const data = await response.json()

      if (data.success) {
        setStatus(`Inicialização do banco de dados concluída com sucesso!`)
        setResult(data)
      } else {
        throw new Error(data.error || `Falha ao inicializar banco de dados`)
      }
    } catch (err) {
      console.error(`Erro ao inicializar banco de dados:`, err)
      setError(err instanceof Error ? err.message : `Erro desconhecido ao inicializar banco de dados`)
      setStatus(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Verificar variáveis de ambiente ao carregar a página
  useEffect(() => {
    checkEnvVars()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center mb-6">
          <Link href="/">
            <Button variant="outline" size="sm" className="border-yellow-600 text-yellow-500">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-yellow-500 ml-4">Diagnóstico Detalhado</h1>
        </div>

        <div className="grid gap-6 mb-6">
          <Card className="bg-gray-900 border-yellow-900">
            <CardHeader>
              <CardTitle className="text-yellow-500">Variáveis de Ambiente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={checkEnvVars}
                disabled={isLoading && action === "env"}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading && action === "env" ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Bug className="mr-2 h-4 w-4" />
                )}
                Verificar Variáveis de Ambiente
              </Button>

              {envVars && (
                <div className="mt-4 p-4 bg-gray-800 rounded-md">
                  <h3 className="text-lg font-medium text-yellow-500 mb-2">Variáveis de Ambiente:</h3>
                  <pre className="text-xs text-gray-300 overflow-auto max-h-60 p-2 bg-black/50 rounded">
                    {JSON.stringify(envVars, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-yellow-900">
            <CardHeader>
              <CardTitle className="text-yellow-500">Teste de Conexão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={testConnection}
                disabled={isLoading && action === "connection"}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading && action === "connection" ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Database className="mr-2 h-4 w-4" />
                )}
                Testar Conexão com o Banco de Dados
              </Button>

              <Button
                onClick={initializeDatabase}
                disabled={isLoading && action === "init"}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading && action === "init" ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Inicializar Banco de Dados
              </Button>

              {status && (
                <div className="p-3 bg-blue-900/50 border border-blue-800 rounded-md text-sm text-blue-200">
                  {status}
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-900/50 border border-red-800 rounded-md text-sm text-red-200">{error}</div>
              )}

              {result && (
                <div className="mt-4 p-4 bg-gray-800 rounded-md">
                  <h3 className="text-lg font-medium text-yellow-500 mb-2">Resultado:</h3>
                  <pre className="text-xs text-gray-300 overflow-auto max-h-60 p-2 bg-black/50 rounded">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-yellow-900">
            <CardHeader>
              <CardTitle className="text-yellow-500">Links Úteis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <Link href="/test-connection" className="text-blue-400 hover:underline">
                  Teste de Conexão Simples
                </Link>
                <Link href="/repair" className="text-blue-400 hover:underline">
                  Página de Reparo
                </Link>
                <Link href="/admin/login" className="text-blue-400 hover:underline">
                  Login Administrativo
                </Link>
                <Link href="/" className="text-blue-400 hover:underline">
                  Página Inicial
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

