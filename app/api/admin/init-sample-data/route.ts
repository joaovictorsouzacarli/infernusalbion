import { NextResponse } from "next/server"
import { initializeSampleData } from "@/lib/db"

export async function POST() {
  try {
    const result = await initializeSampleData()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error initializing sample data:", error)
    return NextResponse.json({ error: "Failed to initialize sample data" }, { status: 500 })
  }
}

