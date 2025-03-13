import { Medal } from "lucide-react"

interface RankMedalProps {
  rank: number
  size?: number
}

export function RankMedal({ rank, size = 24 }: RankMedalProps) {
  if (rank > 3) {
    return <div className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">{rank}</div>
  }

  const medalColors = {
    1: "text-yellow-400", // Ouro
    2: "text-gray-400", // Prata
    3: "text-amber-700", // Bronze
  }

  return (
    <div className={medalColors[rank as keyof typeof medalColors]}>
      <Medal size={size} />
    </div>
  )
}

