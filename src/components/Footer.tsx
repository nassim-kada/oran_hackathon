'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid #e5e7eb',
        background: 'white',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: 1140,
          margin: '0 auto',
          padding: '2rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.25rem' }}>🌊</span>
          <span
            style={{
              fontWeight: 700,
              fontSize: '0.9375rem',
              background: 'linear-gradient(135deg, #023e8a, #00b4d8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            CleanBeach AI
          </span>
          <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>— Gamified Beach Cleaning</span>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link href="/session" style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}>
            My Session
          </Link>
          <Link href="/rewards" style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}>
            Rewards
          </Link>
          <Link href="/leaderboard" style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}>
            Leaderboard
          </Link>
        </div>

        <p suppressHydrationWarning style={{ color: '#9ca3af', fontSize: '0.8125rem' }}>
          © {new Date().getFullYear()} CleanBeach AI. Made with 🌿 for the planet.
        </p>
      </div>
    </footer>
  )
}
