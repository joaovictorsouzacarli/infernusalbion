"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

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

export function AddPlayerForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    class: "",
    avgDps: "0",
    maxDps: "0",
    avgRating: "0",
    isHealer: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, class: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isHealer: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      // Validar dados
      if (!formData.name || !formData.class) {
        throw new Error("Nome e classe são obrigatórios")
      }

      // Enviar dados para a API - adicionando guild="INFERNUS" automaticamente
      const response = await fetch("/api/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          guild: "INFERNUS", // Adicionado automaticamente
          playerBaseId: Date.now(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.details || "Erro ao adicionar jogador")
      }

      // Limpar formulário e mostrar sucesso
      setFormData({
        name: "",
        class: "",
        avgDps: "0",
        maxDps: "0",
        avgRating: "0",
        isHealer: false,
      })
      setSuccess(true)

      // Atualizar a lista de jogadores
      router.refresh()
    } catch (err) {
      console.error("Erro ao adicionar jogador:", err)
      setError(err instanceof Error ? err.message : "Erro desconhecido ao adicionar jogador")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-gray-900 border-yellow-900">
      <CardHeader>
        <CardTitle className="text-yellow-500">Adicionar Novo Jogador</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-900/50 border border-red-800 rounded-md text-sm text-red-200">{error}</div>
          )}

          {success && (
            <div className="p-3 bg-green-900/50 border border-green-800 rounded-md text-sm text-green-200 flex items-center">
              <Check className="mr-2 h-4 w-4" />
              Jogador adicionado com sucesso!
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Jogador</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">Classe</Label>
              <div className="relative">
                <select
                  id="class"
                  name="class"
                  value={formData.class}
                  onChange={(e) => handleSelectChange(e.target.value)}
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
              <Label htmlFor="avgDps">DPS/HPS Médio</Label>
              <Input
                id="avgDps"
                name="avgDps"
                type="number"
                value={formData.avgDps}
                onChange={handleChange}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxDps">DPS/HPS Máximo</Label>
              <Input
                id="maxDps"
                name="maxDps"
                type="number"
                value={formData.maxDps}
                onChange={handleChange}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avgRating">Nota Média</Label>
              <Input
                id="avgRating"
                name="avgRating"
                type="number"
                value={formData.avgRating}
                onChange={handleChange}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="flex items-center space-x-2 pt-6">
              <Checkbox id="isHealer" checked={formData.isHealer} onCheckedChange={handleCheckboxChange} />
              <Label htmlFor="isHealer">É um Healer</Label>
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
              "Adicionar Jogador"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

