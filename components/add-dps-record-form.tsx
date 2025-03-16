"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2, ChevronDown, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import type { Player } from "@/lib/db"

// Lista de classes disponíveis
const availableClasses = [
  "Tank",
  "Quedasanta",
  "Shadowcaller",
  "Quebrareinos",
  "Águia",
  "Frost",
  "Adagas",
  "Endemoniado",
  "Fulgurante",
  "Furabruma",
]

// Tipos de caçada
const huntTypes = ["Dungeon", "Raid", "Mundo Aberto", "Corrupto", "HCE", "Avalon"]

export function AddDpsRecordForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [isLoadingPlayers, setIsLoadingPlayers] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)

  const [formData, setFormData] = useState({
    playerName: "",
    playerClass: "",
    dps: 0,
    rating: 0,
    date: new Date().toISOString().split("T")[0],
    huntType: "Dungeon",
    isHeal: false,
  })

  // Buscar jogadores existentes
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setIsLoadingPlayers(true)
        const res = await fetch("/api/players?t=" + Date.now(), {
          cache: "no-store",
        })

        if (!res.ok) {
          throw new Error("Falha ao carregar jogadores")
        }

        const data = await res.json()
        setPlayers(data)
      } catch (error) {
        console.error("Erro ao buscar jogadores:", error)
        setError("Erro ao carregar lista de jogadores")
      } finally {
        setIsLoadingPlayers(false)
      }
    }

    fetchPlayers()
  }, [])

  // Filtrar jogadores com base na busca
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPlayers([])
      return
    }

    const filtered = players.filter((player) => player.name.toLowerCase().includes(searchQuery.toLowerCase()))
    setFilteredPlayers(filtered)
  }, [searchQuery, players])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: Number(value) }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isHeal: checked }))
  }

  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayer(player)
    setSearchQuery(player.name)
    setFilteredPlayers([])
    setFormData((prev) => ({
      ...prev,
      playerName: player.name,
      playerClass: player.class,
      isHeal: player.isHealer,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      // Validar dados
      if (!formData.playerName || !formData.playerClass || formData.dps <= 0) {
        throw new Error("Jogador, classe e DPS são obrigatórios")
      }

      // Enviar dados para a API
      const response = await fetch("/api/dps-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerId: selectedPlayer?.id || selectedPlayer?._id || Date.now(),
          playerBaseId: selectedPlayer?.playerBaseId || Date.now(),
          playerName: formData.playerName,
          playerClass: formData.playerClass,
          dps: formData.dps,
          rating: formData.rating,
          date: formData.date,
          huntType: formData.huntType,
          isHeal: formData.isHeal,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.details || "Erro ao adicionar registro")
      }

      // Limpar formulário e mostrar sucesso
      setFormData({
        playerName: "",
        playerClass: "",
        dps: 0,
        rating: 0,
        date: new Date().toISOString().split("T")[0],
        huntType: "Dungeon",
        isHeal: false,
      })
      setSelectedPlayer(null)
      setSearchQuery("")
      setSuccess(true)

      // Atualizar a lista
      router.refresh()
    } catch (err) {
      console.error("Erro ao adicionar registro:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido ao adicionar registro")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-gray-900 border-yellow-900">
      <CardHeader>
        <CardTitle className="text-yellow-500">Adicionar Registro de DPS/HPS</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-800 rounded-md text-sm text-red-200">{error}</div>
          )}

          {success && (
            <div className="p-3 bg-green-900/50 border border-green-800 rounded-md text-sm text-green-200 flex items-center">
              <Check className="mr-2 h-4 w-4" />
              Registro adicionado com sucesso!
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="playerSearch">Buscar Jogador</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                id="playerSearch"
                placeholder="Digite o nome do jogador..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {searchQuery.trim() !== "" && (
              <div className="mt-2 max-h-40 overflow-y-auto bg-gray-800 rounded-md border border-gray-700">
                {isLoadingPlayers ? (
                  <div className="p-2 text-center text-gray-400">
                    <Loader2 className="animate-spin h-4 w-4 mx-auto mb-1" />
                    Carregando jogadores...
                  </div>
                ) : filteredPlayers.length > 0 ? (
                  <div className="p-1">
                    {filteredPlayers.map((player) => (
                      <div
                        key={player.id || player._id}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-gray-700 cursor-pointer"
                        onClick={() => handleSelectPlayer(player)}
                      >
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{player.name}</div>
                          <div className="text-xs text-gray-400">{player.class}</div>
                        </div>
                        <div className="text-yellow-500">
                          {player.isHealer ? `${player.avgDps} HPS` : `${player.avgDps} DPS`}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-2 text-center text-gray-500">
                    Nenhum jogador encontrado. Você pode adicionar um novo.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="playerName">Nome do Jogador</Label>
              <Input
                id="playerName"
                name="playerName"
                value={formData.playerName}
                onChange={handleChange}
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="playerClass">Classe</Label>
              <div className="relative">
                <select
                  id="playerClass"
                  name="playerClass"
                  value={formData.playerClass}
                  onChange={handleChange}
                  className="h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white text-sm appearance-none"
                  required
                >
                  <option value="" disabled>
                    Selecione uma classe
                  </option>
                  {availableClasses.map((className) => (
                    <option key={className} value={className}>
                      {className}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dps">Valor de DPS/HPS</Label>
              <Input
                id="dps"
                name="dps"
                type="number"
                value={formData.dps}
                onChange={handleNumberChange}
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Nota (0-10)</Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={formData.rating}
                onChange={handleNumberChange}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="huntType">Tipo de Caçada</Label>
              <div className="relative">
                <select
                  id="huntType"
                  name="huntType"
                  value={formData.huntType}
                  onChange={handleChange}
                  className="h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white text-sm appearance-none"
                >
                  {huntTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Checkbox id="isHeal" checked={formData.isHeal} onCheckedChange={handleCheckboxChange} />
              <Label htmlFor="isHeal">É um registro de Healer (HPS)</Label>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="bg-yellow-600 hover:bg-yellow-700 text-black" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adicionando...
              </>
            ) : (
              "Adicionar Registro"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

