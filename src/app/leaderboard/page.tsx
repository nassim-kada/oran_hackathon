'use client'

import { useEffect, useState } from 'react'

interface LeaderboardEntry {
  _id: string
  username: string
  points: number
}

const medals = ['🥇', '🥈', '🥉']

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((r) => r.json())
      .then((d) => {
        setEntries(d.leaderboard ?? [])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '5rem', color: '#6b7280' }}>Loading leaderboard...</div>
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1f2937' }}>🏆 Leaderboard</h1>
        <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '1.0625rem' }}>Top eco-warriors ranked by green points this week</p>
      </div>

      {entries.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌊</div>
          <p style={{ color: '#6b7280' }}>No entries yet. Be the first to scan and earn points!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {entries.map((entry, idx) => (
            <div
              key={entry._id}
              className="card"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem 1.5rem',
                background: idx === 0 ? 'linear-gradient(135deg, #fffbeb, #fef3c7)' : idx === 1 ? 'linear-gradient(135deg, #f8fafc, #f1f5f9)' : idx === 2 ? 'linear-gradient(135deg, #fff7ed, #ffedd5)' : 'white',
                border: idx === 0 ? '2px solid #fbbf24' : idx === 1 ? '2px solid #cbd5e1' : idx === 2 ? '2px solid #fb923c' : '1px solid #e5e7eb',
              }}
            >
              <div style={{ fontSize: idx < 3 ? '2rem' : '1.25rem', fontWeight: 900, minWidth: 40, textAlign: 'center', color: '#374151' }}>
                {idx < 3 ? medals[idx] : `#${idx + 1}`}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '1.0625rem', color: '#1f2937' }}>{entry.username}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#2d6a4f' }}>{entry.points}</div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>points</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
