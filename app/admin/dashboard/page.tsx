"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Trash2, RefreshCw, Plus, LogOut, ArrowLeft, User } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DBStatus } from "@/components/db-status"
import { AddPlayerForm } from "@/components/add-player-form"
import type { Player } from "@/lib/db"
import { getLoggedInUser, logout, isAuthenticated } from "@/lib/auth"

export default function AdminDashboard() {
  const router = useRouter()
  const [players, setPlayers] = useState<Player[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchText, setSearchText] = useState("")
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([])
  const [authChecked, setAuthChecked] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  // Verificar autenticação apenas uma vez no carregamento inicial
  useEffect(() => {
    const checkAuth = () => {
      try {
        const auth = isAuthenticated()
        console.log("Status de autenticação:", auth)

        if (!auth) {
          const currentPath = window.location.pathname
          console.log("Redirecionando para login:", `/admin/login?from=${currentPath}`)
          router.replace(`/admin/login?from=${currentPath}`)
          return
        }

        setIsAuth(true)
        const user = getLoggedInUser()
        console.log("Usuário logado:", user)
        setLoggedInUser(user)
      } catch (error) {
        console.error("Erro na verificação de autenticação:", error)
        setError("Erro na verificação de autenticação")
      } finally {
        setAuthChecked(true)
      }
    }

    checkAuth()
  }, [router])

  // Buscar dados apenas quando autenticado
  useEffect(() => {
    if (isAuth && authChecked) {
      fetchData()
    }
  }, [isAuth, authChecked])

  // Função para buscar dados
  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      console.log("Iniciando busca de dados...")
      const response = await fetch(`/api/players?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro na resposta da API: ${response.status}`)
      }

      const data = await response.json()
      console.log(`Painel Admin: Recebidos ${data.length} jogadores da API`)
      setPlayers(data)
      setFilteredPlayers(data)
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      setError("Erro ao carregar dados. Por favor, tente novamente.")
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
    try {
      logout()
      router.replace("/")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      setError("Erro ao fazer logout")
    }
  }

  // Função para excluir jogador
  const handleDeletePlayer = async (id: string) => {
    try {
      setIsDeleting(id)
      setError(null)

      const response = await fetch(`/api/players/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Erro ao excluir jogador")
      }

      setSuccess("Jogador excluído com sucesso!")
      await fetchData()
    } catch (error) {
      console.error("Erro ao excluir jogador:", error)
      setError(error instanceof Error ? error.message : "Erro ao excluir jogador")
    } finally {
      setIsDeleting(null)
    }
  }

  // Se ainda não verificou a autenticação, mostrar loading
  if (!authChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <div className="text-yellow-500 text-xl">Verificando acesso...</div>
          <div className="text-gray-400 text-sm mt-2">Aguarde um momento</div>
        </div>
      </div>
    )
  }

  // Se não está autenticado após a verificação, não renderizar nada (redirecionamento já foi feito)
  if (!isAuth) {
    return null
  }

  // Renderizar loading state durante carregamento dos dados
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <div className="text-yellow-500 text-xl">Carregando dados...</div>
          <div className="text-gray-400 text-sm mt-2">Aguarde enquanto os dados do painel são carregados</div>
        </div>
      </div>
    )
  }

  // Rest of the component remains the same...
  return (
    <div className="flex min-h-screen flex-col bg-black/95 text-white relative">
      <header className="sticky top-0 z-10 bg-black/90 border-b border-yellow-600/20 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SWAP_4.png-l04aTeewk2gUJEdgU6w8gsKCKAtxlW.jpeg"
              alt="Infernus Logo"
              className="w-8 h-8 object-contain"
            />
            <h1 className="text-xl font-bold text-yellow-500">INFERNUS - ADMIN</h1>
          </div>
          <div className="flex items-center gap-4">
            {loggedInUser && (
              <div className="flex items-center text-sm text-gray-400">
                <User className="h-4 w-4 mr-1 text-yellow-500" />
                <span>{loggedInUser}</span>
              </div>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout} className="border-yellow-600 text-yellow-500">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
            <Link href="/">
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
                        filteredPlayers.map((player) => (
                          <tr key={player.id || player._id} className="border-b border-yellow-900/30 hover:bg-black/40">
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
                                onClick={() => handleDeletePlayer(player.id || player._id)}
                                disabled={isDeleting === (player.id || player._id)}
                                className="border-red-600 text-red-400 hover:bg-red-900/20"
                              >
                                {isDeleting === (player.id || player._id) ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
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

