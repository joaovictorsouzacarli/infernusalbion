import { NextResponse } from "next/server"
import { clearAllData } from "@/lib/db"

export async function POST() {
  try {
    const result = await clearAllData()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error clearing data:", error)
    return NextResponse.json({ error: "Failed to clear data" }, { status: 500 })
  }
}

