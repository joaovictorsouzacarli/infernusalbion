"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
    guild: "INFERNUS",
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

      // Enviar dados para a API
      const response = await fetch("/api/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
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
        guild: "INFERNUS",
        class: "",
        avgDps: "0",
        maxDps: "0",
        avgRating: "0",
        isHealer: false,
      })
      setSuccess(true)

      // Atualizar a lista de jogadores
      router.refresh()

      // Testar a conexão com o MongoDB
      await fetch("/api/test-mongodb")
        .then((res) => res.json())
        .then((data) => console.log("Teste de conexão:", data))
        .catch((err) => console.error("Erro no teste de conexão:", err))
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
              <Label htmlFor="guild">Guilda</Label>
              <Input
                id="guild"
                name="guild"
                value={formData.guild}
                onChange={handleChange}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">Classe</Label>
              <Select value={formData.class} onValueChange={handleSelectChange} required>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Selecione uma classe" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {availableClasses.map((className) => (
                    <SelectItem key={className} value={className}>
                      {className}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

