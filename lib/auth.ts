// Lista de administradores permitidos
export const ADMIN_USERS = [
  {
    username: "MorteSolo", // Corrigido para remover espaço
    password: "admin123",
  },
  {
    username: "Mtx1996",
    password: "admin123",
  },
  {
    username: "TioBarney",
    password: "admin123",
  },
  {
    username: "SamantaBengaly",
    password: "admin123",
  },
]

// Função para verificar credenciais
export function verifyCredentials(username: string, password: string): boolean {
  try {
    // Normalizar o nome de usuário (remover espaços extras e converter para o formato correto)
    const normalizedUsername = username.trim()

    // Verificar se as credenciais correspondem a algum administrador
    const isValid = ADMIN_USERS.some((admin) => admin.username === normalizedUsername && admin.password === password)

    console.log(`Tentativa de login: ${normalizedUsername} - ${isValid ? "Sucesso" : "Falha"}`)
    return isValid
  } catch (error) {
    console.error("Erro na verificação de credenciais:", error)
    return false
  }
}

// Função para obter o nome de usuário do localStorage
export function getLoggedInUser(): string | null {
  if (typeof window === "undefined") return null

  try {
    return localStorage.getItem("adminUsername")
  } catch (error) {
    console.error("Erro ao obter usuário do localStorage:", error)
    return null
  }
}

// Função para verificar se o usuário está autenticado
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false

  try {
    const authToken = localStorage.getItem("adminAuth")
    const username = localStorage.getItem("adminUsername")
    const authCookie = document.cookie.includes("adminAuth=true")

    return !!authToken && !!username && authCookie
  } catch (error) {
    console.error("Erro na verificação de autenticação:", error)
    return false
  }
}

// Função para fazer login
export function login(username: string): void {
  try {
    localStorage.setItem("adminAuth", "true")
    localStorage.setItem("adminUsername", username)

    // Definir cookie com expiração de 24 horas
    const expiryDate = new Date()
    expiryDate.setTime(expiryDate.getTime() + 24 * 60 * 60 * 1000)
    document.cookie = `adminAuth=true; expires=${expiryDate.toUTCString()}; path=/`
  } catch (error) {
    console.error("Erro ao fazer login:", error)
    throw new Error("Falha ao realizar login")
  }
}

// Função para fazer logout
export function logout(): void {
  try {
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("adminUsername")
    document.cookie = "adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  } catch (error) {
    console.error("Erro ao fazer logout:", error)
  }
}

