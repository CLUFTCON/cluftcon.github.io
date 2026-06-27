import { Section } from '@/components/Section'

const formSrc =
  'https://docs.google.com/forms/d/e/1FAIpQLSd32eqEqzbXNA8jgYPph2oMqCnLf1LBQ_12K75LmNto8BJxWg/viewform?embedded=true'

export function SignUpSection() {
  return (
    <Section
      id="sign-up"
      title="Sign Up"
      description="Leave your email to be notified when tickets become available. You can also share any questions or requests — this is not a formal registration yet."
    >
      <div className="mx-auto w-full max-w-2xl overflow-hidden rounded-xl border bg-background shadow-sm">
        <iframe
          src={formSrc}
          title="CLUFTCON interest form"
          className="block h-[556px] w-full border-0"
          loading="lazy"
        >
          Loading…
        </iframe>
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Open to undergraduate students across Ontario. We&apos;ll reach out when
        registration opens.
      </p>
    </Section>
  )
}
