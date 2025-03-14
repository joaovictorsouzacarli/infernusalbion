// Lista de administradores permitidos
export const ADMIN_USERS = [
  {
    username: "MorteSolo",
    password: "admin123", // Em produção, isso deveria ser um hash
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
  // Verificar se as credenciais correspondem a algum administrador
  return ADMIN_USERS.some((admin) => admin.username === username && admin.password === password)
}

// Função para obter o nome de usuário do localStorage
export function getLoggedInUser(): string | null {
  if (typeof window === "undefined") return null

  return localStorage.getItem("adminUsername")
}

// Função para verificar se o usuário está autenticado
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false

  const authToken = localStorage.getItem("adminAuth")
  const username = localStorage.getItem("adminUsername")
  const authCookie = document.cookie.includes("adminAuth=true")

  return !!authToken && !!username && authCookie
}

// Função para fazer login
export function login(username: string): void {
  localStorage.setItem("adminAuth", "true")
  localStorage.setItem("adminUsername", username)

  // Definir cookie com expiração de 24 horas
  const expiryDate = new Date()
  expiryDate.setTime(expiryDate.getTime() + 24 * 60 * 60 * 1000)
  document.cookie = `adminAuth=true; expires=${expiryDate.toUTCString()}; path=/`
}

// Função para fazer logout
export function logout(): void {
  localStorage.removeItem("adminAuth")
  localStorage.removeItem("adminUsername")
  document.cookie = "adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
}

