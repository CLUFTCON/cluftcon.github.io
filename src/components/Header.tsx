import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const navItems = [
  { label: 'Story', href: '#story' },
  { label: 'Program', href: '#program' },
  { label: 'Speakers', href: '#speakers' },
  { label: 'Attend', href: '#attend' },
  { label: 'Sponsors', href: '#sponsors' },
] as const

export function Header({ onJoin }: { onJoin: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const close = () => setMobileOpen(false)

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${mobileOpen ? 'menu-open' : ''}`}>
      <div className="nav-shell">
        <a href="#top" className="wordmark" onClick={close}>
          <strong>CLUFTCON</strong>
          <span>/ˈkləft.kɑn/</span>
        </a>

        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
          <button className="nav-cta" onClick={onJoin}>Join the list</button>
        </nav>

        <button
          className="menu-button"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
          <div className="mobile-branch" aria-hidden>枝 · 語 · 花</div>
          {navItems.map((item, index) => (
            <a key={item.href} href={item.href} onClick={close}>
              <span>0{index + 1}</span>{item.label}
            </a>
          ))}
          <button onClick={() => { close(); onJoin() }}>Join the interest list</button>
        </nav>
      )}
    </header>
  )
}
