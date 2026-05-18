import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'

const FASTAPI_URL = 'http://127.0.0.1:8000'

export const REWARDS = [
  { id: 'umbrella', name: 'Beach Umbrella Discount', cost: 50, emoji: '☂️' },
  { id: 'icecream', name: 'Free Ice Cream', cost: 70, emoji: '🍦' },
  { id: 'parking', name: 'Parking Discount', cost: 100, emoji: '🅿️' },
  { id: 'water', name: 'Water Activities Access', cost: 150, emoji: '🏄' },
]

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ rewards: REWARDS, userPoints: 0, redeemed: [] })
  }

  try {
    const res = await fetch(`${FASTAPI_URL}/user/${session.username}`)
    const data = await res.json()
    return NextResponse.json({
      rewards: REWARDS,
      userPoints: data.points ?? 0,
      redeemed: data.redeemed ?? [],
    })
  } catch (e) {
    return NextResponse.json({ rewards: REWARDS, userPoints: 0, redeemed: [] })
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { rewardId } = await req.json()
  const reward = REWARDS.find((r) => r.id === rewardId)
  if (!reward) {
    return NextResponse.json({ error: 'Reward not found' }, { status: 404 })
  }

  try {
    const res = await fetch(`${FASTAPI_URL}/redeem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: session.username,
        reward_id: rewardId,
        reward_name: reward.name,
        cost: reward.cost,
      }),
    })
    const data = await res.json()
    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 400 })
    }
    return NextResponse.json({ message: 'Reward redeemed!', remainingPoints: data.remaining_points })
  } catch (e) {
    return NextResponse.json({ error: 'API unavailable' }, { status: 503 })
  }
}
