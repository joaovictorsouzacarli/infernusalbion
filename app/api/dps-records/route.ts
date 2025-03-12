import { type NextRequest, NextResponse } from "next/server"
import { getDpsRecords, lastDataUpdate } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const records = await getDpsRecords()
    return NextResponse.json(records, {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "Last-Modified": new Date(lastDataUpdate).toUTCString(),
      },
    })
  } catch (error) {
    console.error("Error fetching DPS records:", error)
    return NextResponse.json({ error: "Failed to fetch DPS records" }, { status: 500 })
  }
}

