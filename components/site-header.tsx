"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="border-b border-yellow-600/20 bg-black/80">
      <div className="container flex items-center justify-between h-16">
        {/* Logo and Title */}
        <div className="flex items-center gap-2">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SWAP_4.png-l04aTeewk2gUJEdgU6w8gsKCKAtxlW.jpeg"
            alt="Infernus Logo"
            className="w-8 h-8 object-contain"
          />
          <h1 className="text-xl font-bold text-yellow-500">INFERNUS</h1>
        </div>

        {/* Admin Link and Refresh Button */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.reload()}
            className="text-yellow-500 hover:bg-yellow-900/20"
            title="Atualizar dados"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Link href="/admin/login">
            <Button variant="outline" className="border-yellow-600 text-yellow-500">
              Área Administrativa
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

