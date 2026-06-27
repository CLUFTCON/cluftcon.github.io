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
          University of Toronto&apos;s first undergraduate research conference,
          organized by the UofT Computational Linguistics Club (CLCUOFT) and the
          UTM Computational Linguistics Society (UTMCLS).
        </p>
        <p>
          There exist a plethora of conferences dedicated to computational
          linguistics (e.g. ACL, COLING, etc.), but there is no venue solely
          for undergraduates with limited research experience looking to
          &ldquo;dip their toes into the water.&rdquo; Our clubs&apos; shared
          mission, and the goal of CLUFTCON, is to foster curiosity, interest,
          and participation among undergraduate students in computational
          linguistics.
        </p>
        <p>
          Participation is limited to undergraduate students across Ontario.
          Applicants may submit any research, whether done in a dedicated class
          or extracurricular, pertaining to NLP, cognitive science, formal
          linguistics, AI, and related fields.
        </p>
        <p>
          The conference will feature 2–3 keynote speeches from professors, a
          dedicated lunch for presenters, faculty, and sponsors, and poster
          presentations in the Bahen atrium for attendee viewing.
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
