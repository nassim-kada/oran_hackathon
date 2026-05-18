import Link from 'next/link'

const features = [
  { icon: '🤖', title: 'AI Object Detection', desc: 'Our YOLOv8-powered smart bin camera detects every bottle and can thrown in — in real time.' },
  { icon: '📱', title: 'QR Session', desc: 'Scan your personal QR code at the smart bin — the AI links every detected item to your account.' },
  { icon: '🌿', title: 'Instant Green Points', desc: 'Bottle = +15 pts, Can = +20 pts. Points are credited the moment the AI detects the item.' },
  { icon: '🏆', title: 'Community Leaderboard', desc: 'Compete with other eco-warriors in your area and rise to the top.' },
  { icon: '🎁', title: 'Redeem Rewards', desc: 'Unlock beach umbrellas, free ice cream, parking discounts, and more.' },
  { icon: '📡', title: 'ESP32 Powered', desc: 'The smart bin streams live video from an ESP32 camera to our AI pipeline for 24/7 detection.' },
]

export default function HomePage() {
  return (
    <div>
      <section className="wave-bg gradient-ocean" style={{ padding: '6rem 1.5rem 8rem', textAlign: 'center', color: 'white' }}>
        <div className="content-above-wave" style={{ maxWidth: 700, margin: '0 auto' }}>
          <div className="animate-fade-up">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌊</div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '1.25rem' }}>
              blueBin.<br />Earn Rewards. 🌱
            </h1>
            <p style={{ fontSize: '1.125rem', opacity: 0.88, maxWidth: 520, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
              Upload waste photos, get instant AI classification, and earn green points for keeping our beaches beautiful.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" className="btn" style={{ background: 'white', color: '#0077b6', fontWeight: 700, fontSize: '1rem', padding: '0.875rem 2rem' }}>
                Get Started Free →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '5rem 1.5rem', maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.875rem', fontWeight: 800, marginBottom: '0.75rem', color: '#1f2937' }}>
          Everything you need to make an impact
        </h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '3rem', fontSize: '1.0625rem' }}>
          AI-powered beach cleaning meets gamification
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {features.map((f) => (
            <div key={f.title} className="card">
              <div style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, fontSize: '1.0625rem', marginBottom: '0.5rem', color: '#1f2937' }}>{f.title}</h3>
              <p style={{ color: '#6b7280', fontSize: '0.9375rem', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: 'linear-gradient(135deg, #2d6a4f, #52b788)', padding: '5rem 1.5rem', textAlign: 'center', color: 'white' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Ready to make a difference?</h2>
        <p style={{ opacity: 0.9, marginBottom: '2rem', fontSize: '1.0625rem' }}>Join thousands of eco-warriors cleaning beaches and earning rewards.</p>
        <Link href="/register" className="btn" style={{ background: 'white', color: '#2d6a4f', fontWeight: 700, fontSize: '1rem', padding: '0.875rem 2.5rem' }}>
          Join blueBin 🌊
        </Link>
      </section>
    </div>
  )
}
