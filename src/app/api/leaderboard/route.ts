import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db/mongoose'
import User from '@/models/User'

export async function GET() {
  await connectDB()
  const users = await User.find().sort({ points: -1 }).limit(10).select('username points')
  return NextResponse.json({ leaderboard: users })
}
