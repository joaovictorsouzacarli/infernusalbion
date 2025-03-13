import Link from "next/link"
import { Button } from "@/components/ui/button"

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

        {/* Admin Link */}
        <Link href="/admin/login">
          <Button variant="outline" className="border-yellow-600 text-yellow-500">
            Área Administrativa
          </Button>
        </Link>
      </div>
    </header>
  )
}

