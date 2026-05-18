'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface UserInfo {
  _id: string
  username: string
  points: number
}

export default function SessionPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [livePoints, setLivePoints] = useState(0)
  const [pointsDelta, setPointsDelta] = useState(0)
  const [showPop, setShowPop] = useState(false)
  const [sessionActive, setSessionActive] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Load current user and check if session is active
  useEffect(() => {
    let authData: { user: UserInfo | null } = { user: null }
    try {
      const stored = localStorage.getItem('user')
      if (stored) authData.user = JSON.parse(stored)
    } catch {}

    if (!authData.user) {
      router.push('/login')
      return
    }

    fetch('/api/bin/session')
      .then((r) => r.json().catch(() => ({ active: false })))
      .then((sessionData) => {
        setUser(authData.user)
        setLivePoints(authData.user!.points)
        
        if (!sessionData.active) {
          fetch('/api/bin/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'start' }),
          }).then(() => {
            setSessionActive(true)
            setLoading(false)
          }).catch(() => {
            setSessionActive(false)
            setLoading(false)
          })
        } else {
          setSessionActive(true)
          setLoading(false)
        }
      })
      .catch(() => router.push('/login'))
  }, [router])

  // Poll for live point updates when session is active
  const pollPoints = useCallback(async () => {
    if (!user) return
    const res = await fetch(`/api/points?userId=${user._id}`)
    if (!res.ok) return
    const data = await res.json()
    if (data.points > livePoints) {
      const diff = data.points - livePoints
      setPointsDelta(diff)
      setLivePoints(data.points)
      if (user) {
        const updatedUser = { ...user, points: data.points }
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
      }
      setShowPop(true)
      setTimeout(() => setShowPop(false), 1400)
    }
  }, [user, livePoints])

  useEffect(() => {
    if (!sessionActive || !user) return
    const interval = setInterval(pollPoints, 2500)
    return () => clearInterval(interval)
  }, [sessionActive, user, pollPoints])

  const toggleSession = async () => {
    setActionLoading(true)
    const action = sessionActive ? 'end' : 'start'
    try {
      const res = await fetch('/api/bin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (res.ok) {
        setSessionActive(!sessionActive)
      }
    } catch (e) {
      console.error('Failed to toggle session', e)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '6rem 1.5rem', color: '#6b7280' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌊</div>
        Loading your session…
      </div>
    )
  }

  if (!user) return null

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '3rem 1.5rem' }}>
      {/* Point pop animation */}
      {showPop && (
        <div className="point-pop" style={{ top: '30%', left: '50%', transform: 'translateX(-50%)' }}>
          +{pointsDelta} 🌿
        </div>
      )}

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1f2937' }}>
          📱 Smart Bin Session
        </h1>
        <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '1.0625rem' }}>
          Connect to the smart bin to earn points automatically when you throw waste.
        </p>
      </div>

      {/* Live points card */}
      <div
        className="card"
        style={{
          textAlign: 'center',
          marginBottom: '1.5rem',
          background: sessionActive ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)' : '#f9fafb',
          border: sessionActive ? '2px solid #86efac' : '2px dashed #d1d5db',
        }}
      >
        <p style={{ color: sessionActive ? '#16a34a' : '#6b7280', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>
          {user.username}&apos;s Green Points
        </p>
        <div style={{ fontSize: '3.5rem', fontWeight: 900, color: sessionActive ? '#2d6a4f' : '#1f2937', lineHeight: 1 }}>
          {livePoints.toLocaleString()}
        </div>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.25rem' }}>total points</p>

        {sessionActive ? (
          <div
            style={{
              marginTop: '0.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#dcfce7',
              color: '#16a34a',
              fontSize: '0.8125rem',
              fontWeight: 700,
              padding: '0.3rem 0.75rem',
              borderRadius: 999,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                background: '#16a34a',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'pulse-glow 1.5s ease-in-out infinite',
              }}
            />
            Bin is connected & listening
          </div>
        ) : (
          <div
            style={{
              marginTop: '0.75rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#6b7280',
              fontSize: '0.8125rem',
              fontWeight: 500,
              padding: '0.3rem 0.75rem',
            }}
          >
            Not connected to the bin
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: '1rem', color: '#1f2937', marginBottom: '1rem' }}>
          How it works
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { n: '1', icon: '📱', text: 'You scanned the bin! The smart bin is now linked to your account.' },
            { n: '2', icon: '🤖', text: 'The AI camera detects each bottle or can you drop in.' },
            { n: '3', icon: '🌿', text: 'Bottle = +15 pts  ·  Can = +20 pts — credited instantly!' },
            { n: '4', icon: '✅', text: 'Tap "End Session" when you are done to let others use it.' },
          ].map((step) => (
            <div key={step.n} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #023e8a, #0077b6)',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {step.n}
              </div>
              <p style={{ color: '#374151', fontSize: '0.9375rem', paddingTop: '0.3rem' }}>
                <span style={{ marginRight: '0.4rem' }}>{step.icon}</span>
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {sessionActive && (
          <button
            className="btn btn-outline"
            style={{ flex: 1 }}
            onClick={toggleSession}
            disabled={actionLoading}
          >
            {actionLoading ? 'Please wait...' : '⏹ End Session'}
          </button>
        )}
        <Link href="/rewards" className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }}>
          🎁 Rewards Store
        </Link>
      </div>
    </div>
  )
}
