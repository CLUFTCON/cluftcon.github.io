import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Speakers', href: '#speakers' },
  { label: 'Schedule', href: '#schedule' },
  { label: 'Sign Up', href: '#sign-up' },
  { label: 'Sponsors', href: '#sponsors' },
] as const

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  function closeMobileMenu() {
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
        <a
          href="#"
          className="font-heading text-sm font-semibold tracking-tight sm:text-base"
          onClick={closeMobileMenu}
        >
          CLUFTCON
        </a>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              size="sm"
              asChild
              className={cn(item.label === 'Sign Up' && 'font-medium')}
            >
              <a href={item.href}>{item.label}</a>
            </Button>
          ))}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {mobileOpen ? (
        <nav
          id="mobile-nav"
          className="border-t bg-background px-4 py-4 md:hidden"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Button
                  variant="ghost"
                  size="lg"
                  asChild
                  className="h-11 w-full justify-start"
                  onClick={closeMobileMenu}
                >
                  <a href={item.href}>{item.label}</a>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
