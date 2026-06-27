import { CalendarRange, MapPin, Sparkles } from 'lucide-react'

import { AboutSection } from '@/components/AboutSection'
import { ComingSoonSection } from '@/components/ComingSoonSection'
import { Header } from '@/components/Header'
import { SignUpSection } from '@/components/SignUpSection'
import { SponsorsSection } from '@/components/SponsorsSection'
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
              CLUFTCON
            </h1>
            <p className="mx-auto mt-4 max-w-prose text-base text-muted-foreground sm:text-lg">
              The University of Toronto&apos;s first undergraduate research
              conference in computational linguistics.
            </p>

            <div className="mx-auto mt-8 flex max-w-lg flex-col items-stretch gap-3 rounded-xl border bg-muted/50 px-4 py-6 text-muted-foreground sm:max-w-2xl sm:flex-row sm:items-center sm:justify-center sm:gap-6">
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-foreground">
                <CalendarRange className="size-5 shrink-0" aria-hidden />
                <span>September 24, 2026 · 12–3 PM EST</span>
              </div>
              <span className="hidden text-border sm:inline" aria-hidden>
                |
              </span>
              <div className="flex items-center justify-center gap-2 text-sm">
                <MapPin className="size-5 shrink-0 text-primary" aria-hidden />
                <span>Bahen Centre atrium</span>
              </div>
              <span className="hidden text-border sm:inline" aria-hidden>
                |
              </span>
              <div className="flex items-center justify-center gap-2 text-sm">
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
              <Button size="lg" variant="outline" asChild>
                <a href="#sponsors">Become a Sponsor</a>
              </Button>
            </div>
          </div>
        </section>

        <AboutSection />

        <ComingSoonSection
          id="speakers"
          title="Speakers"
          description="2–3 keynote addresses from faculty — speaker lineup coming soon."
        />

        <ComingSoonSection
          id="schedule"
          title="Schedule"
          description="Keynote speeches, a catered lunch, and poster presentations — full program details coming soon."
        />

        <SignUpSection />

        <SponsorsSection />
      </main>

      <footer className="border-t bg-background/60 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-5xl text-center text-sm text-muted-foreground">
          <p>
            CLUFTCON · University of Toronto · September 24, 2026 · Bahen Centre
            atrium
          </p>
          <p className="mt-1">
            Organized by CLCUOFT and UTMCLS
          </p>
        </div>
      </footer>
    </div>
  )
}
