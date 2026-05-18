export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - var(--navbar-height, 64px))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        background:
          'radial-gradient(ellipse at 60% 0%, rgba(0, 180, 216, 0.15) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(45, 106, 79, 0.1) 0%, transparent 50%), linear-gradient(160deg, #f0f9ff 0%, #e0f2fe 40%, #f0fdf4 100%)',
      }}
    >
      {children}
    </div>
  )
}
