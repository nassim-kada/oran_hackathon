'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Metadata } from 'next'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Login failed. Please check your credentials.')
      return
    }

    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user))
    }

    router.push('/rewards')
    router.refresh()
  }

  return (
    <div
      className="animate-fade-up"
      style={{
        width: '100%',
        maxWidth: 440,
        background: 'white',
        borderRadius: '1.25rem',
        boxShadow: '0 8px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
        overflow: 'hidden',
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          height: 5,
          background: 'linear-gradient(90deg, #023e8a, #0077b6, #00b4d8)',
        }}
      />

      <div style={{ padding: '2.25rem 2rem 2rem' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.75rem', marginBottom: '0.75rem', lineHeight: 1 }}>🌊</div>
          <h1
            style={{
              fontSize: '1.625rem',
              fontWeight: 800,
              color: '#1f2937',
              marginBottom: '0.375rem',
            }}
          >
            Welcome back
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.9375rem' }}>
            Sign in to your CleanBeach AI account
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}
        >
          <div>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontWeight: 600,
                fontSize: '0.875rem',
                color: '#374151',
                marginBottom: '0.425rem',
              }}
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              className="input"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.425rem',
              }}
            >
              <label
                htmlFor="password"
                style={{ fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}
              >
                Password
              </label>
            </div>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              className="input"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          {error && (
            <div
              role="alert"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '0.625rem',
                padding: '0.75rem 1rem',
                color: '#dc2626',
                fontSize: '0.875rem',
              }}
            >
              <span style={{ flexShrink: 0 }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            id="login-submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ marginTop: '0.25rem', width: '100%', padding: '0.875rem' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span
                  style={{
                    width: 16,
                    height: 16,
                    border: '2px solid rgba(255,255,255,0.4)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    display: 'inline-block',
                    animation: 'spin 0.7s linear infinite',
                  }}
                />
                Signing in…
              </span>
            ) : (
              'Sign In →'
            )}
          </button>
        </form>

        {/* Footer link */}
        <p
          style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            fontSize: '0.9375rem',
            color: '#6b7280',
          }}
        >
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            style={{ color: '#0077b6', fontWeight: 700, textDecoration: 'none' }}
          >
            Create one free →
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
