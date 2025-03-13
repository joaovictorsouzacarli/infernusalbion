"use client"

import { useState, useEffect } from "react"
import { CheckCircle, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DBStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [message, setMessage] = useState<string>("")
  const [lastChecked, setLastChecked] = useState<string>("")
  const [isChecking, setIsChecking] = useState(false)

  const checkConnection = async () => {
    try {
      setIsChecking(true)
      setStatus("loading")
      const response = await fetch("/api/test-mongodb")
      const data = await response.json()

      if (data.success) {
        setStatus("connected")
        setMessage(`Conectado ao MongoDB. ${data.playerCount || 0} jogadores encontrados.`)
      } else {
        setStatus("error")
        const isAuthError = data.details?.includes("AuthenticationFailed") || data.details?.includes("SCRAM")
        setMessage(
          isAuthError
            ? "Erro: Falha na autenticação com o MongoDB. Verifique suas credenciais."
            : `Erro: ${data.error || "Falha na conexão"}`,
        )
      }
    } catch (error) {
      setStatus("error")
      setMessage("Erro ao verificar conexão com o banco de dados")
    } finally {
      setIsChecking(false)
      setLastChecked(new Date().toLocaleTimeString())
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-yellow-500">Status do Banco de Dados</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={checkConnection}
          disabled={isChecking}
          className="h-8 px-2 text-gray-400 hover:text-gray-300"
        >
          <RefreshCw className={`h-4 w-4 ${isChecking ? "animate-spin" : ""}`} />
          <span className="sr-only">Verificar conexão</span>
        </Button>
      </div>

      <div className="rounded-md border border-yellow-900/50 bg-yellow-950/20 p-3">
        <div className="flex items-center gap-2">
          {status === "loading" && <RefreshCw className="h-4 w-4 animate-spin text-blue-400" />}
          {status === "connected" && <CheckCircle className="h-4 w-4 text-green-500" />}
          {status === "error" && <AlertCircle className="h-4 w-4 text-red-500" />}

          <span
            className={`text-sm ${
              status === "connected" ? "text-green-400" : status === "error" ? "text-red-400" : "text-blue-400"
            }`}
          >
            {message || "Verificando conexão..."}
          </span>
        </div>

        {lastChecked && <div className="mt-2 text-xs text-gray-500">Última verificação: {lastChecked}</div>}
      </div>
    </div>
  )
}

