import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongoose'
import User from '@/models/User'
import BinSession from '@/models/BinSession'

// Points awarded per detected item type
const POINTS: Record<string, number> = {
  bottle: 15,
  can: 20,
}

/**
 * POST /api/points
 *
 * Called by the ESP32 / Python YOLO script whenever a bottle or can
 * crosses the detection line.
 *
 * Body: { token: string, type: 'bottle' | 'can', count?: number }
 *
 * The `token` must match the shared secret in POINTS_API_SECRET env var,
 * so only the physical device can award points.
 */
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { token, type, count = 1 } = body as {
    token: string
    type: string
    count?: number
  }

  // Validate shared secret
  const secret = process.env.POINTS_API_SECRET
  if (!secret || token !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!type || !POINTS[type]) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const pointsToAdd = POINTS[type] * Math.max(1, Math.min(count, 100))

  await connectDB()

  // Find the currently active user for the bin
  const binSession = await BinSession.findOne({ binId: 'default', active: true })
  
  if (!binSession) {
    return NextResponse.json({ error: 'No active session found for the bin' }, { status: 404 })
  }

  const user = await User.findByIdAndUpdate(
    binSession.userId,
    { $inc: { points: pointsToAdd } },
    { new: true }
  ).select('username points')

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({
    ok: true,
    pointsAwarded: pointsToAdd,
    totalPoints: user.points,
    username: user.username,
  })
}

/**
 * GET /api/points?userId=xxx
 *
 * Returns the current point balance for a user (used by the session page
 * to poll for live updates).
 */
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 })
  }

  await connectDB()
  const user = await User.findById(userId).select('username points')
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ points: user.points, username: user.username })
}
