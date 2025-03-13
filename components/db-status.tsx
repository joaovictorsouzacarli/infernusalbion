"use client"

import { useState, useEffect } from "react"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"

export function DBStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [message, setMessage] = useState<string>("")
  const [lastChecked, setLastChecked] = useState<string>("")

  const checkConnection = async () => {
    setStatus("loading")
    try {
      const response = await fetch("/api/test-mongodb")
      const data = await response.json()

      if (data.success) {
        setStatus("connected")
        setMessage(`Conectado ao MongoDB. ${data.playerCount || 0} jogadores encontrados.`)
      } else {
        setStatus("error")
        setMessage(`Erro: ${data.error || "Falha na conexão"}`)
      }
    } catch (error) {
      setStatus("error")
      setMessage("Erro ao verificar conexão")
    }

    setLastChecked(new Date().toLocaleTimeString())
  }

  useEffect(() => {
    checkConnection()
  }, [])

  return (
    <div className="text-sm">
      <div className="flex items-center justify-between mb-1">
        <div className="font-medium">Status do Banco de Dados</div>
        <button
          onClick={checkConnection}
          className="text-xs text-gray-400 hover:text-gray-300 flex items-center"
          aria-label="Verificar conexão"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Verificar
        </button>
      </div>

      <div className="flex items-center">
        {status === "loading" && <RefreshCw className="h-4 w-4 mr-2 text-blue-400 animate-spin" />}
        {status === "connected" && <CheckCircle className="h-4 w-4 mr-2 text-green-500" />}
        {status === "error" && <XCircle className="h-4 w-4 mr-2 text-red-500" />}

        <span
          className={`text-xs ${status === "connected" ? "text-green-400" : status === "error" ? "text-red-400" : "text-blue-400"}`}
        >
          {message || "Verificando conexão..."}
        </span>
      </div>

      {lastChecked && <div className="text-xs text-gray-500 mt-1">Última verificação: {lastChecked}</div>}
    </div>
  )
}

