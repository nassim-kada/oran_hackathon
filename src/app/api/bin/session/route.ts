import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { connectDB } from '@/lib/db/mongoose'
import BinSession from '@/models/BinSession'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { action } = await req.json()

  await connectDB()

  if (action === 'start') {
    // Overwrite the current active user for the default bin
    await BinSession.findOneAndUpdate(
      { binId: 'default' },
      { userId: session.userId, active: true },
      { upsert: true, new: true }
    )
    return NextResponse.json({ success: true, message: 'Session started' })
  } else if (action === 'end') {
    // End the session only if it belongs to the current user
    await BinSession.findOneAndUpdate(
      { binId: 'default', userId: session.userId },
      { active: false },
      { new: true }
    )
    return NextResponse.json({ success: true, message: 'Session ended' })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  const binSession = await BinSession.findOne({ binId: 'default', active: true })
  
  if (binSession && binSession.userId.toString() === session.userId) {
    return NextResponse.json({ active: true })
  }

  return NextResponse.json({ active: false })
}
