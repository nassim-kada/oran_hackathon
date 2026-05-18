'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

interface User {
  _id: string
  username: string
  points: number
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) {
        setUser(JSON.parse(stored))
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    }
  }, [pathname])

  // Close user menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
    setUserMenuOpen(false)
  }, [pathname])

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    localStorage.removeItem('user')
    setUser(null)
    setUserMenuOpen(false)
    router.push('/')
    router.refresh()
  }

  const navLinks = [
    { href: '/rewards', label: 'Rewards', icon: '🎁' },
    { href: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          {/* Logo */}
          <Link href="/" className="navbar-logo">
            <span className="navbar-logo-icon">🌊</span>
            <span className="navbar-logo-text">blueBin</span>
          </Link>

          {/* Desktop nav links */}
          <div className="navbar-links">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`navbar-link${isActive(l.href) ? ' navbar-link-active' : ''}`}
              >
                <span className="navbar-link-icon">{l.icon}</span>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth area */}
          <div className="navbar-auth">
            {user ? (
              <div className="navbar-user" ref={userMenuRef}>
                <button
                  className="navbar-user-btn"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  aria-expanded={userMenuOpen}
                  aria-label="User menu"
                >
                  <span className="navbar-avatar">{user.username[0].toUpperCase()}</span>
                  <span className="navbar-username">{user.username}</span>
                  <span className="navbar-points-badge">🌿 {user.points} pts</span>
                  <span className="navbar-chevron">{userMenuOpen ? '▲' : '▼'}</span>
                </button>

                {userMenuOpen && (
                  <div className="navbar-dropdown">
                    <div className="navbar-dropdown-header">
                      <div className="navbar-dropdown-name">{user.username}</div>
                      <div className="navbar-dropdown-points">🌿 {user.points} green points</div>
                    </div>
                    <div className="navbar-dropdown-divider" />
                    <Link href="/rewards" className="navbar-dropdown-item">
                      🎁 My Rewards
                    </Link>
                    <Link href="/leaderboard" className="navbar-dropdown-item">
                      🏆 Leaderboard
                    </Link>
                    <div className="navbar-dropdown-divider" />
                    <button onClick={logout} className="navbar-dropdown-item navbar-dropdown-logout">
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="navbar-auth-buttons">
                <Link
                  href="/login"
                  className={`btn btn-outline navbar-auth-btn${isActive('/login') ? ' active' : ''}`}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className={`btn btn-primary navbar-auth-btn${isActive('/register') ? ' active' : ''}`}
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className={`navbar-hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle mobile menu"
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="navbar-mobile-drawer">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`navbar-mobile-link${isActive(l.href) ? ' active' : ''}`}
              >
                <span>{l.icon}</span> {l.label}
              </Link>
            ))}
            <div className="navbar-mobile-divider" />
            {user ? (
              <>
                <div className="navbar-mobile-user">
                  <span className="navbar-avatar">{user.username[0].toUpperCase()}</span>
                  <div>
                    <div className="navbar-mobile-username">{user.username}</div>
                    <div className="navbar-mobile-pts">🌿 {user.points} pts</div>
                  </div>
                </div>
                <button onClick={logout} className="navbar-mobile-link navbar-mobile-logout">
                  🚪 Sign Out
                </button>
              </>
            ) : (
              <div className="navbar-mobile-auth">
                <Link href="/login" className="btn btn-outline" style={{ flex: 1, textAlign: 'center' }}>
                  Sign In
                </Link>
                <Link href="/register" className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }}>
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  )
}
