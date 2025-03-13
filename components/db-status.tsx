"use client"

import { useState, useEffect } from "react"
import { AlertCircle, CheckCircle } from "lucide-react"

export function DBStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [message, setMessage] = useState<string>("Verificando conexão com o banco de dados...")

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch("/api/admin/check-db-connection")
        const data = await response.json()

        if (data.connected) {
          setStatus("connected")
          setMessage("Conectado ao MongoDB")
        } else {
          setStatus("error")
          setMessage(`Erro na conexão com o MongoDB: ${data.error || "Erro desconhecido"}`)
        }
      } catch (error) {
        setStatus("error")
        setMessage(`Erro ao verificar conexão: ${error instanceof Error ? error.message : String(error)}`)
      }
    }

    checkConnection()
  }, [])

  return (
    <div className="flex items-center gap-2 text-sm">
      {status === "loading" && (
        <div className="animate-pulse flex items-center gap-2 text-yellow-500">
          <AlertCircle className="h-4 w-4" />
          <span>{message}</span>
        </div>
      )}

      {status === "connected" && (
        <div className="flex items-center gap-2 text-green-500">
          <CheckCircle className="h-4 w-4" />
          <span>{message}</span>
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="h-4 w-4" />
          <span>{message}</span>
        </div>
      )}
    </div>
  )
}

