import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'

const formSrc = 'https://docs.google.com/forms/d/e/1FAIpQLSd32eqEqzbXNA8jgYPph2oMqCnLf1LBQ_12K75LmNto8BJxWg/viewform?embedded=true'

export function InterestFormDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeButton = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return
    const prior = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    closeButton.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !panel.current) return
      const focusable = Array.from(panel.current.querySelectorAll<HTMLElement>('button, iframe'))
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      prior?.focus()
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="drawer-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section ref={panel} className="form-drawer" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <div className="drawer-head">
          <div><span className="mono-kicker">ATTEND · 2026</span><h2 id="form-title">Join the interest list</h2></div>
          <button ref={closeButton} onClick={onClose} aria-label="Close interest form"><X /></button>
        </div>
        <p>Leave your email and we’ll let you know when formal registration opens.</p>
        <iframe src={formSrc} title="CLUFTCON interest form" loading="lazy">Loading…</iframe>
      </section>
    </div>
  )
}
