export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
        <div className="text-yellow-500 text-xl">Carregando...</div>
        <div className="text-gray-400 text-sm mt-2">Aguarde enquanto os dados são carregados</div>
      </div>
    </div>
  )
}

