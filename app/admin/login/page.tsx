"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { verifyCredentials, login, isAuthenticated } from "@/lib/auth"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromPath = searchParams.get("from") || "/admin/dashboard"

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Verificar se já está autenticado
  useEffect(() => {
    if (isAuthenticated()) {
      router.push(fromPath)
    }
  }, [router, fromPath])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    // Validar campos
    if (!username.trim() || !password.trim()) {
      setError("Preencha todos os campos")
      setIsLoading(false)
      return
    }

    // Verificar credenciais
    if (verifyCredentials(username, password)) {
      // Login bem-sucedido
      login(username)
      router.push(fromPath)
    } else {
      // Login falhou
      setError("Credenciais inválidas")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black/95 p-4">
      <div className="w-full max-w-md">
        <Card className="bg-gray-900 border-yellow-900/50">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SWAP_4.png-l04aTeewk2gUJEdgU6w8gsKCKAtxlW.jpeg"
                alt="Infernus Logo"
                className="w-16 h-16 object-contain"
              />
            </div>
            <CardTitle className="text-2xl text-center text-yellow-500">INFERNUS CAÇADAS</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Acesso administrativo ao sistema de ranking
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-red-900/50 border border-red-800 rounded-md text-sm text-red-200">{error}</div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">
                  Nome de Usuário
                </Label>
                <Input
                  id="username"
                  placeholder="Digite seu nome de usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-black"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
              <Link href="/" className="w-full">
                <Button variant="outline" className="w-full border-yellow-600/50 text-yellow-500">
                  Voltar para o site
                </Button>
              </Link>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

