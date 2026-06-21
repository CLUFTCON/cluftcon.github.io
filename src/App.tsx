import { CalendarRange, Sparkles } from 'lucide-react'

import { ComingSoonSection } from '@/components/ComingSoonSection'
import { Header } from '@/components/Header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export default function App() {
  return (
    <div className="flex min-h-svh flex-col bg-gradient-to-b from-background via-muted/30 to-muted/60">
      <Header />

      <main className="flex-1">
        <section className="px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-5xl text-center">
            <Badge className="mb-4 uppercase tracking-wide">
              University of Toronto
            </Badge>
            <h1 className="font-heading text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
              Computational Linguistics Conference
            </h1>
            <p className="mx-auto mt-4 max-w-prose text-base text-muted-foreground sm:text-lg">
              The first conference dedicated to computational linguistics at the
              University of Toronto. Coming&nbsp;September&nbsp;2026!
            </p>

            <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-2 rounded-xl border bg-muted/50 px-4 py-6 text-muted-foreground sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <CalendarRange className="size-5 shrink-0" aria-hidden />
                <span>September 2026</span>
              </div>
              <span className="hidden text-border sm:inline" aria-hidden>
                |
              </span>
              <div className="flex items-center gap-2 text-sm">
                <Sparkles
                  className="size-5 shrink-0 text-primary"
                  aria-hidden
                />
                <span>First edition</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <a href="#sign-up">Sign Up</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#about">Learn More</a>
              </Button>
            </div>
          </div>
        </section>

        <ComingSoonSection
          id="about"
          title="About"
          description="Learn about the conference, its mission, and what to expect."
        />

        <ComingSoonSection
          id="speakers"
          title="Speakers"
          description="Meet the researchers and practitioners presenting at CLUFTCON."
        />

        <ComingSoonSection
          id="schedule"
          title="Schedule"
          description="Browse talks, panels, and events across the conference program."
        />

        <ComingSoonSection
          id="sign-up"
          title="Sign Up"
          description="Registration and submission details will be available here."
        />

        <ComingSoonSection
          id="sponsors"
          title="Sponsors"
          description="Our partners and supporters making this conference possible."
          className="border-b"
        />
      </main>

      <footer className="border-t bg-background/60 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-5xl text-center text-sm text-muted-foreground">
          <p>
            Computational Linguistics Conference · University of Toronto ·
            September 2026
          </p>
        </div>
      </footer>
    </div>
  )
}
