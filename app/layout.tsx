import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "INFERNUS CAÇADAS - Sistema de Ranking DPS",
  description: "Sistema de ranking e estatísticas de DPS/HPS para a guilda INFERNUS no Albion Online.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} storageKey="infernus-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

