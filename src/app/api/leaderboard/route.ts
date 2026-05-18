import { NextResponse } from 'next/server'

const FASTAPI_URL = 'http://127.0.0.1:8000'

export async function GET() {
  try {
    const res = await fetch(`${FASTAPI_URL}/leaderboard`)
    const data = await res.json()

    const leaderboard = data.leaderboard.map(([username, info]: [string, any], idx: number) => ({
      _id: String(idx),
      username,
      points: info.points,
    }))

    return NextResponse.json({ leaderboard })
  } catch (e) {
    return NextResponse.json({ leaderboard: [] })
  }
}