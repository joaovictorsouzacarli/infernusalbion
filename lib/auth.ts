export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false

  const localAuth = localStorage.getItem("adminAuth")
  const cookieAuth = document.cookie.includes("adminAuth=true")

  return Boolean(localAuth && cookieAuth)
}

export function setAuthenticated(value: boolean) {
  if (typeof window === "undefined") return

  if (value) {
    localStorage.setItem("adminAuth", "true")
    document.cookie = "adminAuth=true; path=/; max-age=86400" // 24 hours
  } else {
    localStorage.removeItem("adminAuth")
    document.cookie = "adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
  }
}

