export const samplePlayers = [
  {
    playerBaseId: 1,
    name: "Player 1",
    guild: "Guild A",
    class: "Tank",
    avgDps: "1000",
    maxDps: "1500",
    avgRating: "80",
    hunts: 10,
    isHealer: false,
  },
  {
    playerBaseId: 2,
    name: "Player 2",
    guild: "Guild B",
    class: "Quedasanta",
    avgDps: "500",
    maxDps: "750",
    avgRating: "90",
    hunts: 15,
    isHealer: true,
  },
  {
    playerBaseId: 3,
    name: "Player 3",
    guild: "Guild A",
    class: "Shadowcaller",
    avgDps: "1200",
    maxDps: "1800",
    avgRating: "75",
    hunts: 12,
    isHealer: false,
  },
]

export const sampleDpsRecords = [
  {
    playerId: 1,
    playerBaseId: 1,
    playerName: "Player 1",
    playerClass: "Tank",
    dps: 1100,
    rating: 85,
    date: "2024-01-01",
    huntType: "Solo",
    isHeal: false,
  },
  {
    playerId: 2,
    playerBaseId: 2,
    playerName: "Player 2",
    playerClass: "Quedasanta",
    dps: 600,
    rating: 92,
    date: "2024-01-01",
    huntType: "Group",
    isHeal: true,
  },
  {
    playerId: 1,
    playerBaseId: 1,
    playerName: "Player 1",
    playerClass: "Tank",
    dps: 1300,
    rating: 78,
    date: "2024-01-02",
    huntType: "Group",
    isHeal: false,
  },
]

