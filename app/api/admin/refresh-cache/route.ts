import { NextResponse } from "next/server"
import { lastDataUpdate } from "@/lib/db"

export async function GET() {
  return NextResponse.json({ lastUpdate: lastDataUpdate })
}

export async function POST() {
  return NextResponse.json({ success: true, lastUpdate: lastDataUpdate })
}

