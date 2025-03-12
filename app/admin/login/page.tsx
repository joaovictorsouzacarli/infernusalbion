"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function AdminLogin() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simulação de autenticação - em produção, isso seria uma chamada de API
    setTimeout(() => {
      // Credenciais de demonstração - em produção, isso seria validado no servidor
      if (
        (username === "admin" && password === "admin123") ||
        (username === "TioBarney" && password === "admin123") ||
        (username === "SamantaBengaly" && password === "admin123")
      ) {
        // Armazenar token de autenticação (em produção, seria um JWT)
        localStorage.setItem("adminAuth", "true")
        document.cookie = "adminAuth=true; path=/; max-age=86400" // 24 hours

        // Redirecionar para a página anterior ou dashboard
        const params = new URLSearchParams(window.location.search)
        const from = params.get("from") || "/admin/dashboard"
        router.push(from)
      } else {
        setError("Credenciais inválidas. Tente novamente.")
        setLoading(false)
      }
    }, 1000)
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
            <h1 className="text-xl font-bold text-yellow-500">INFERNUS CAÇADAS</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-400 hover:text-yellow-500">
              Rankings
            </Link>
            <Link href="/estatisticas" className="text-sm font-medium text-gray-400 hover:text-yellow-500">
              Estatísticas
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-yellow-900">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-yellow-500">Área do Administrador</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Entre com suas credenciais para gerenciar os rankings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-900/50 border border-red-800 rounded-md text-sm text-red-200">{error}</div>
              )}

              <div className="space-y-2">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Nome de usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-gray-800 border-gray-700"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-700 text-black" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>

              <div className="text-center text-sm text-gray-500">
                <Link href="/" className="hover:text-yellow-500 hover:underline">
                  Voltar para o site principal
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
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

