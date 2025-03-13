"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Trash2, RefreshCw, Plus, LogOut, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DBStatus } from "@/components/db-status"
import { AddPlayerForm } from "@/components/add-player-form"
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
  const [showAddForm, setShowAddForm] = useState(false)
  const timestamp = Date.now()

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
      const response = await fetch(`/api/players?t=${Date.now()}`)
      if (response.ok) {
        const data = await response.json()
        setPlayers(data)
        setFilteredPlayers(data)
      } else {
        setError("Falha ao carregar dados")
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

  // Função para sair
  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    document.cookie = "adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    router.push("/")
  }

  // Função para testar a conexão com o MongoDB
  const testMongoDBConnection = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/test-mongodb")
      const data = await response.json()

      if (data.success) {
        setSuccess(`Conexão com MongoDB estabelecida com sucesso! Total de jogadores: ${data.playerCount}`)
      } else {
        setError(`Erro na conexão com MongoDB: ${data.error}`)
      }
    } catch (error) {
      console.error("Erro ao testar conexão:", error)
      setError("Erro ao testar conexão com MongoDB")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) return null

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
            <Card className="bg-gray-900 border-yellow-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-yellow-500">Total de Jogadores</CardTitle>
                <CardDescription className="text-gray-400">Número de jogadores registrados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white">{players.length}</div>
              </CardContent>
            </Card>

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
                  className="border-green-600 text-green-400 hover:bg-green-900/20"
                  onClick={() => setShowAddForm(!showAddForm)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {showAddForm ? "Ocultar Formulário" : "Adicionar Jogador"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-yellow-600 text-yellow-500 hover:bg-yellow-900/20"
                  onClick={testMongoDBConnection}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Testar Conexão MongoDB
                </Button>
                <div className="mt-2 pt-2 border-t border-gray-800">
                  <DBStatus />
                </div>
              </CardContent>
            </Card>
          </div>

          {showAddForm && (
            <div className="mb-8">
              <AddPlayerForm />
            </div>
          )}

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
                        filteredPlayers.map((player, index) => (
                          <tr
                            key={player.id || player._id || index}
                            className="border-b border-yellow-900/30 hover:bg-black/40"
                          >
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
                                onClick={() => {}}
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

