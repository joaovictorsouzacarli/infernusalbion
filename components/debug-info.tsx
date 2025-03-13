"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bug } from "lucide-react"

export function DebugInfo({ data }: { data: any }) {
  const [showDebug, setShowDebug] = useState(false)

  if (!showDebug) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 right-4 bg-black/50 text-yellow-500"
      >
        <Bug className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-black/90 border border-yellow-600 rounded-md text-xs text-white max-w-md max-h-96 overflow-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-yellow-500">Informações de Depuração</h3>
        <Button variant="ghost" size="sm" onClick={() => setShowDebug(false)} className="text-gray-400">
          Fechar
        </Button>
      </div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}

