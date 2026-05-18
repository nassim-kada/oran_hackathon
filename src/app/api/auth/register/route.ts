import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db/mongoose'
import User from '@/models/User'
import { signToken } from '@/lib/auth/jwt'

export async function POST(req: NextRequest) {
  const { username, email, password } = await req.json()

  if (!username || !email || !password) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })
  }

  await connectDB()

  const existing = await User.findOne({ $or: [{ email }, { username }] })
  if (existing) {
    return NextResponse.json({ error: 'Email or username already taken' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await User.create({ username, email, passwordHash })

  const token = signToken({ userId: user._id.toString(), username: user.username, isAdmin: user.isAdmin })

  const res = NextResponse.json({ message: 'Registered successfully' }, { status: 201 })
  res.cookies.set('token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 })
  return res
}
