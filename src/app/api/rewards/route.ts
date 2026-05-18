import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { connectDB } from '@/lib/db/mongoose'
import User from '@/models/User'
import Redemption from '@/models/Redemption'

export const REWARDS = [
  { id: 'umbrella', name: 'Beach Umbrella Discount', cost: 50, emoji: '☂️' },
  { id: 'icecream', name: 'Free Ice Cream', cost: 70, emoji: '🍦' },
  { id: 'parking', name: 'Parking Discount', cost: 100, emoji: '🅿️' },
  { id: 'water', name: 'Water Activities Access', cost: 150, emoji: '🏄' },
]

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ rewards: REWARDS, userPoints: 0 })
  }

  await connectDB()
  const user = await User.findById(session.userId).select('points')
  const redeemed = await Redemption.find({ userId: session.userId }).distinct('rewardName')

  return NextResponse.json({ rewards: REWARDS, userPoints: user?.points ?? 0, redeemed })
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

  await connectDB()
  const user = await User.findById(session.userId)
  if (!user || user.points < reward.cost) {
    return NextResponse.json({ error: 'Insufficient points' }, { status: 400 })
  }

  await Redemption.create({ userId: session.userId, rewardName: reward.name, pointsCost: reward.cost })
  user.points -= reward.cost
  await user.save()

  return NextResponse.json({ message: 'Reward redeemed!', remainingPoints: user.points })
}
