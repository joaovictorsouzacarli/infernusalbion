import Link from "next/link"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="border-b border-yellow-600/20">
      <div className="container flex flex-col items-center justify-between py-4 md:h-40">
        {/* Logo Container */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-32 h-32 md:w-40 md:h-40 relative mb-2">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/SWAP_4.png-l04aTeewk2gUJEdgU6w8gsKCKAtxlW.jpeg"
              alt="Infernus Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-yellow-500 text-center">INFERNUS CAÇADAS</h1>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
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

