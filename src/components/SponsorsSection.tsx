import { Mail } from 'lucide-react'

import { Section } from '@/components/Section'
import { Button } from '@/components/ui/button'

const sponsorEmail = 'complanggroupuoft@gmail.com'

const sponsorBenefits = [
  'Directly invest in the next generation of computational linguists and NLP researchers',
  "Support undergraduate research at one of the world's leading universities",
  'Connect your brand with hard-working, career-driven students',
  'Help establish a lasting home for undergraduate research in computational linguistics',
] as const

const expenses = [
  'Printing poster boards',
  'Merchandise',
  'Catering',
  'Honorariums for keynote speakers',
] as const

export function SponsorsSection() {
  return (
    <Section
      id="sponsors"
      title="Why Sponsor CLUFTCON?"
      className="border-b"
    >
      <div className="space-y-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
        <p>
          Running a conference is an ambitious undertaking. As undergraduate
          students, we primarily rely on funds from our respective departments
          to finance our events, though such funding is limited. We are looking
          for industry partners who share our vision of providing bright
          undergraduates a space to showcase their hard work.
        </p>
        <p>
          By joining us in building CLUFTCON, you would be directly investing
          in the next generation of premier computational linguists and NLP
          researchers. As a founding partner, your company helps our clubs
          establish a forever-home for undergraduate research in computational
          linguistics.
        </p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border bg-muted/40 p-6">
          <h3 className="font-heading text-base font-semibold text-foreground sm:text-lg">
            What you gain
          </h3>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {sponsorBenefits.map((benefit) => (
              <li key={benefit} className="flex gap-2">
                <span className="text-primary" aria-hidden>
                  ·
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border bg-muted/40 p-6">
          <h3 className="font-heading text-base font-semibold text-foreground sm:text-lg">
            Where support goes
          </h3>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {expenses.map((expense) => (
              <li key={expense} className="flex gap-2">
                <span className="text-primary" aria-hidden>
                  ·
                </span>
                <span>{expense}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-4 text-center">
        <p className="text-base text-muted-foreground sm:text-lg">
          We are grateful for any support you can offer and are eager to begin
          our partnership!
        </p>
        <Button size="lg" asChild>
          <a href={`mailto:${sponsorEmail}`}>
            <Mail aria-hidden />
            {sponsorEmail}
          </a>
        </Button>
      </div>
    </Section>
  )
}
