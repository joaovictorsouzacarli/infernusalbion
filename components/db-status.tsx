"use client"

import { useState, useEffect } from "react"
import { CheckCircle, RefreshCw, AlertCircle, Database, PenToolIcon as Tool } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DBStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [message, setMessage] = useState<string>("")
  const [lastChecked, setLastChecked] = useState<string>("")
  const [isChecking, setIsChecking] = useState(false)
  const [isDiagnosing, setIsDiagnosing] = useState(false)
  const [isFixing, setIsFixing] = useState(false)
  const [diagnosticResults, setDiagnosticResults] = useState<any>(null)
  const [fixResults, setFixResults] = useState<any>(null)

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

  const runDiagnostic = async () => {
    try {
      setIsDiagnosing(true)
      setMessage("Executando diagnóstico do banco de dados...")

      const response = await fetch("/api/diagnose-db")
      const data = await response.json()

      if (data.success) {
        setDiagnosticResults(data.diagnosticResults)
        setMessage(
          `Diagnóstico concluído. ${data.diagnosticResults.invalidPlayers.length} jogadores e ${data.diagnosticResults.invalidRecords.length} registros com problemas.`,
        )
      } else {
        setMessage(`Erro no diagnóstico: ${data.error || "Falha desconhecida"}`)
      }
    } catch (error) {
      setMessage("Erro ao executar diagnóstico")
      console.error("Erro no diagnóstico:", error)
    } finally {
      setIsDiagnosing(false)
      setLastChecked(new Date().toLocaleTimeString())
    }
  }

  const fixDatabase = async () => {
    try {
      setIsFixing(true)
      setMessage("Corrigindo banco de dados...")

      const response = await fetch("/api/fix-database")
      const data = await response.json()

      if (data.success) {
        setFixResults(data.results)
        setMessage(
          `Correção concluída. ${data.results.playersFixed} jogadores e ${data.results.recordsFixed} registros corrigidos.`,
        )
      } else {
        setMessage(`Erro na correção: ${data.error || "Falha desconhecida"}`)
      }
    } catch (error) {
      setMessage("Erro ao corrigir banco de dados")
      console.error("Erro na correção:", error)
    } finally {
      setIsFixing(false)
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
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={checkConnection}
            disabled={isChecking}
            className="h-8 px-2 text-gray-400 hover:text-gray-300"
            title="Verificar conexão"
          >
            <RefreshCw className={`h-4 w-4 ${isChecking ? "animate-spin" : ""}`} />
            <span className="sr-only">Verificar conexão</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={runDiagnostic}
            disabled={isDiagnosing || status !== "connected"}
            className="h-8 px-2 text-gray-400 hover:text-gray-300"
            title="Diagnosticar banco de dados"
          >
            <Database className={`h-4 w-4 ${isDiagnosing ? "animate-spin" : ""}`} />
            <span className="sr-only">Diagnosticar</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={fixDatabase}
            disabled={isFixing || status !== "connected"}
            className="h-8 px-2 text-gray-400 hover:text-gray-300"
            title="Corrigir banco de dados"
          >
            <Tool className={`h-4 w-4 ${isFixing ? "animate-spin" : ""}`} />
            <span className="sr-only">Corrigir</span>
          </Button>
        </div>
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

        {diagnosticResults && (
          <div className="mt-2 border-t border-yellow-900/30 pt-2">
            <div className="text-xs text-gray-400">Resultados do diagnóstico:</div>
            <div className="text-xs text-gray-500 mt-1">
              <div>Jogadores: {diagnosticResults.playerCount}</div>
              <div>Registros: {diagnosticResults.recordCount}</div>
              <div>Jogadores inválidos: {diagnosticResults.invalidPlayers.length}</div>
              <div>Registros inválidos: {diagnosticResults.invalidRecords.length}</div>
            </div>
          </div>
        )}

        {fixResults && (
          <div className="mt-2 border-t border-yellow-900/30 pt-2">
            <div className="text-xs text-gray-400">Resultados da correção:</div>
            <div className="text-xs text-gray-500 mt-1">
              <div>Jogadores corrigidos: {fixResults.playersFixed}</div>
              <div>Registros corrigidos: {fixResults.recordsFixed}</div>
              {fixResults.errors.length > 0 && <div className="text-red-400">Erros: {fixResults.errors.length}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

