'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Reward {
  id: string
  name: string
  cost: number
  emoji: string
}

export default function RewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [userPoints, setUserPoints] = useState(0)
  const [redeemed, setRedeemed] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [redeeming, setRedeeming] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/rewards')
      .then((r) => r.json())
      .then((d) => {
        setRewards(d.rewards ?? [])
        setUserPoints(d.userPoints ?? 0)
        setRedeemed(d.redeemed ?? [])
        setLoading(false)
      })
  }, [])

  async function redeem(reward: Reward) {
    setRedeeming(reward.id)
    setMessage('')

    const res = await fetch('/api/rewards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rewardId: reward.id }),
    })

    const data = await res.json()
    setRedeeming(null)

    if (!res.ok) {
      setMessage(data.error ?? 'Failed to redeem')
      return
    }

    setUserPoints(data.remainingPoints)
    setRedeemed((prev) => [...prev, reward.name])
    setMessage(`🎉 "${reward.name}" redeemed successfully!`)
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: '#6b7280' }}>Loading rewards...</div>
    )
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1f2937' }}>🎁 Rewards Store</h1>
        <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '1.0625rem' }}>Redeem your green points for exclusive beach rewards</p>
        <div className="badge badge-ocean" style={{ marginTop: '1rem', fontSize: '1rem', padding: '0.5rem 1.25rem' }}>
          🌿 Your balance: <strong style={{ marginLeft: 6 }}>{userPoints} points</strong>
        </div>
      </div>

      {message && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.75rem', padding: '1rem', color: '#166534', textAlign: 'center', marginBottom: '1.5rem', fontWeight: 600 }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        {rewards.map((r) => {
          const isUnlocked = userPoints >= r.cost
          const isRedeemed = redeemed.includes(r.name)
          return (
            <div
              key={r.id}
              className={`card ${!isUnlocked && !isRedeemed ? 'locked' : ''}`}
              style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}
            >
              {isRedeemed && (
                <div style={{ position: 'absolute', top: 10, right: 10, background: '#2d6a4f', color: 'white', fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: 999, fontWeight: 700 }}>
                  Redeemed ✓
                </div>
              )}
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>{r.emoji}</div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#1f2937', marginBottom: '0.5rem' }}>{r.name}</h3>
              <div className="badge badge-ocean" style={{ marginBottom: '1rem' }}>{r.cost} pts</div>
              <button
                id={`redeem-${r.id}`}
                className="btn btn-green"
                style={{ width: '100%', opacity: isUnlocked && !isRedeemed ? 1 : 0.45 }}
                disabled={!isUnlocked || isRedeemed || redeeming === r.id}
                onClick={() => redeem(r)}
              >
                {isRedeemed ? '✓ Claimed' : redeeming === r.id ? 'Redeeming...' : isUnlocked ? 'Redeem' : `🔒 ${r.cost} pts needed`}
              </button>
            </div>
          )
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
        <p style={{ color: '#9ca3af', fontSize: '0.9375rem' }}>Need more points?</p>
        <Link href="/session" className="btn btn-primary" style={{ marginTop: '0.75rem', display: 'inline-flex' }}>📱 Start Session</Link>
      </div>
    </div>
  )
}
