import { Clock, MapPin, Users } from 'lucide-react'

import { Section } from '@/components/Section'

const eventDetails = [
  {
    icon: Clock,
    label: 'When',
    value: 'September 24, 2026 · 12–3 PM EST',
  },
  {
    icon: MapPin,
    label: 'Where',
    value: 'Bahen Centre atrium, University of Toronto St. George',
  },
  {
    icon: Users,
    label: 'Who',
    value: 'Undergraduate students across Ontario',
  },
] as const

export function AboutSection() {
  return (
    <Section id="about" title="About the Event">
      <div className="space-y-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
        <p>
          <span className="font-medium text-foreground">CLUFTCON</span>{' '}
          <span className="text-sm sm:text-base">(/ˈkləft.kɑn/)</span> is the
          University of Toronto&apos;s student-led computational linguistics event,
          organized by the UofT Computational Linguistics Club (CLCUOFT) and the
          UTM Computational Linguistics Society (UTMCLS).
        </p>
        <p>
          Join fellow students for an afternoon exploring language, computation,
          and cognition through invited talks and conversation.
        </p>
        <p>
          Participation is limited to undergraduate students across Ontario.
        </p>
        <p>
          The event features talks by Prof. Enas AlTarawneh and Aidan Wong,
          alongside lunch and conversation with fellow attendees.
        </p>
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-3">
        {eventDetails.map(({ icon: Icon, label, value }) => (
          <li
            key={label}
            className="flex flex-col gap-3 rounded-xl border bg-muted/40 p-5"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Icon className="size-4 shrink-0 text-primary" aria-hidden />
              {label}
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {value}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
