"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Trash2, RefreshCw, Plus, LogOut, ArrowLeft, User, Check, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Player } from "@/lib/db"

export default function AdminDashboard() {
  const router = useRouter()
  const [players, setPlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchText, setSearchText] = useState("")
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const timestamp = Date.now()

  // Estado para o modal de adição de jogador
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false)
  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({
    name: "",
    guild: "INFERNUS", // Valor padrão
    class: "",
    avgDps: "0",
    maxDps: "0",
    avgRating: "0",
    isHealer: false,
    playerBaseId: Date.now(), // ID base temporário
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Classes disponíveis
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

  // Verificar autenticação
  useEffect(() => {
    const auth = localStorage.getItem("adminAuth")
    const authCookie = document.cookie.includes("adminAuth=true")

    if (!auth || !authCookie) {
      const currentPath = window.location.pathname
      router.push(`/admin/login?from=${currentPath}`)
    } else {
      setIsAuthenticated(true)
      fetchData()
    }
  }, [router])

  // Função para buscar dados
  const fetchData = async () => {
    try {
      setIsLoading(true)

      // Buscar jogadores
      const playersResponse = await fetch(`/api/players?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      })

      if (playersResponse.ok) {
        const playersData = await playersResponse.json()
        setPlayers(playersData)
        setFilteredPlayers(playersData)
      } else {
        setError("Falha ao carregar dados de jogadores")
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      setError("Erro ao carregar dados")
    } finally {
      setIsLoading(false)
    }
  }

  // Filtrar jogadores quando o texto de busca mudar
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredPlayers(players)
      return
    }

    const filtered = players.filter(
      (player) =>
        player.name.toLowerCase().includes(searchText.toLowerCase()) ||
        player.class.toLowerCase().includes(searchText.toLowerCase()),
    )

    setFilteredPlayers(filtered)
  }, [searchText, players])

  // Função para excluir um jogador
  const deletePlayer = async (id: string) => {
    try {
      setIsDeleting(true)
      setError(null)
      setSuccess(null)

      const response = await fetch(`/api/players/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSuccess("Jogador excluído com sucesso!")
        fetchData() // Recarregar dados após a exclusão
      } else {
        setError("Falha ao excluir jogador")
      }
    } catch (error) {
      console.error("Erro ao excluir jogador:", error)
      setError("Erro ao excluir jogador")
    } finally {
      setIsDeleting(false)
    }
  }

  // Função para limpar todos os dados
  const clearAllData = async () => {
    if (!window.confirm("Tem certeza que deseja limpar TODOS os dados? Esta ação não pode ser desfeita!")) {
      return
    }

    try {
      setIsDeleting(true)
      setError(null)
      setSuccess(null)

      const response = await fetch("/api/admin/clear-data", {
        method: "POST",
      })

      if (response.ok) {
        setSuccess("Todos os dados foram limpos com sucesso!")
        fetchData() // Recarregar dados
      } else {
        setError("Falha ao limpar dados")
      }
    } catch (error) {
      console.error("Erro ao limpar dados:", error)
      setError("Erro ao limpar dados")
    } finally {
      setIsDeleting(false)
    }
  }

  // Funções para o modal de adicionar jogador
  const openAddPlayerModal = () => {
    setShowAddPlayerModal(true)
  }

  const closeAddPlayerModal = () => {
    setShowAddPlayerModal(false)
    setNewPlayer({
      name: "",
      guild: "INFERNUS",
      class: "",
      avgDps: "0",
      maxDps: "0",
      avgRating: "0",
      isHealer: false,
      playerBaseId: Date.now(),
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    if (type === "number") {
      setNewPlayer({
        ...newPlayer,
        [name]: Number.parseInt(value) || 0,
      })
    } else {
      setNewPlayer({
        ...newPlayer,
        [name]: value,
      })
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setNewPlayer({
      ...newPlayer,
      isHealer: checked,
    })
  }

  const handleSelectChange = (value: string) => {
    setNewPlayer({
      ...newPlayer,
      class: value,
    })
  }

  const addPlayer = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!newPlayer.name || !newPlayer.class) {
      setError("Nome e classe são obrigatórios")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const response = await fetch("/api/players", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newPlayer,
          playerBaseId: Date.now(), // Garantir um ID único baseado no timestamp
        }),
      })

      if (response.ok) {
        setSuccess("Jogador cadastrado com sucesso!")
        closeAddPlayerModal()
        fetchData()
      } else {
        const data = await response.json()
        setError(data.error || "Falha ao cadastrar jogador")
      }
    } catch (error) {
      console.error("Erro ao cadastrar jogador:", error)
      setError("Erro ao cadastrar jogador")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Função para sair
  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    document.cookie = "adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    router.push("/")
  }

  if (!isAuthenticated) {
    return null // Não renderizar nada enquanto verifica autenticação
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="mb-4 text-yellow-500 text-xl">Carregando...</div>
          <div className="text-gray-400 text-sm">Aguarde enquanto os dados do painel são carregados</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <header className="sticky top-0 z-10 bg-black border-b border-yellow-600">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SWAP_4.png-1E01OYWrRQZhycLojFhDgjHeUCjw8l.jpeg"
              width={40}
              height={40}
              alt="Infernus Logo"
              className="rounded-md"
            />
            <h1 className="text-xl font-bold text-yellow-500">INFERNUS CAÇADAS - ADMIN</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleLogout} className="border-yellow-600 text-yellow-500">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
            <Link href={`/?t=${timestamp}`}>
              <Button variant="outline" size="sm" className="border-yellow-600 text-yellow-500">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao site
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-6 md:py-12">
          <h2 className="text-3xl font-bold tracking-tight text-yellow-500 mb-6">Painel do Administrador</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-800 rounded-md text-sm text-red-200">{error}</div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-900/50 border border-green-800 rounded-md text-sm text-green-200">
              {success}
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {/* Card com estatísticas */}
            <Card className="bg-gray-900 border-yellow-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-yellow-500">Total de Jogadores</CardTitle>
                <CardDescription className="text-gray-400">Número de jogadores registrados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white">{players.length}</div>
              </CardContent>
            </Card>

            {/* Card com ações rápidas */}
            <Card className="bg-gray-900 border-yellow-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-yellow-500">Ações Rápidas</CardTitle>
                <CardDescription className="text-gray-400">Gerenciamento de dados</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchData}
                  className="border-blue-600 text-blue-400 hover:bg-blue-900/20"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Atualizar Dados
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openAddPlayerModal}
                  className="border-green-600 text-green-400 hover:bg-green-900/20"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Jogador
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllData}
                  className="border-red-600 text-red-400 hover:bg-red-900/20"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Limpar Todos os Dados
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-yellow-500 mb-4">Gerenciar Jogadores</h3>
            <div className="flex items-center justify-between mb-4">
              <Input
                type="search"
                placeholder="Buscar jogador..."
                className="max-w-sm bg-gray-900 border-gray-700 text-white"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>

            <Card className="bg-gray-900 border-yellow-900">
              <CardContent className="p-0">
                <div className="overflow-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-yellow-900/50 bg-black/50 text-sm">
                        <th className="px-4 py-3 text-left font-medium text-gray-400">Nome</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-400">Classe</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-400">Média DPS/HPS</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-400">Máximo DPS/HPS</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-400">Nota</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-400">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPlayers.length > 0 ? (
                        filteredPlayers.map((player) => (
                          <tr key={player._id} className="border-b border-yellow-900/30 hover:bg-black/40">
                            <td className="px-4 py-3 text-sm font-medium text-white">{player.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-300">{player.class}</td>
                            <td className="px-4 py-3 text-sm font-medium text-yellow-500">
                              {player.avgDps} {player.isHealer ? "HPS" : "DPS"}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-yellow-500">
                              {player.maxDps} {player.isHealer ? "HPS" : "DPS"}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-yellow-500">{player.avgRating}</td>
                            <td className="px-4 py-3 text-sm">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deletePlayer(player._id!)}
                                disabled={isDeleting}
                                className="border-red-600 text-red-400 hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Excluir</span>
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                            {searchText
                              ? "Nenhum jogador encontrado com esse critério."
                              : "Nenhum jogador cadastrado. Adicione novos jogadores."}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Modal de Adicionar Jogador */}
      {showAddPlayerModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <Card className="bg-gray-900 border-yellow-900">
              <CardHeader>
                <CardTitle className="text-yellow-500 flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Adicionar Novo Jogador
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Preencha os dados do jogador para adicioná-lo ao ranking
                </CardDescription>
              </CardHeader>
              <form onSubmit={addPlayer}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">
                      Nome do Jogador
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={newPlayer.name}
                      onChange={handleInputChange}
                      placeholder="Digite o nome do jogador"
                      className="bg-gray-800 border-gray-700 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="class" className="text-gray-300">
                      Classe
                    </Label>
                    <Select value={newPlayer.class} onValueChange={handleSelectChange}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Selecione a classe" />
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

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="avgDps" className="text-gray-300">
                        DPS/HPS
                      </Label>
                      <Input
                        id="avgDps"
                        name="avgDps"
                        value={newPlayer.avgDps}
                        onChange={handleInputChange}
                        placeholder="0"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="avgRating" className="text-gray-300">
                        Nota
                      </Label>
                      <Input
                        id="avgRating"
                        name="avgRating"
                        value={newPlayer.avgRating}
                        onChange={handleInputChange}
                        placeholder="0"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="isHealer" checked={newPlayer.isHealer} onCheckedChange={handleCheckboxChange} />
                    <Label htmlFor="isHealer" className="text-gray-300">
                      É um Healer
                    </Label>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeAddPlayerModal}
                    className="border-gray-600 text-gray-300"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-yellow-600 hover:bg-yellow-700 text-black"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>Salvando...</>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Salvar Jogador
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      )}

      <footer className="border-t border-yellow-900/50 bg-black">
        <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} INFERNUS CAÇADAS. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}

