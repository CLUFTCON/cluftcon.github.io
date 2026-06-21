import { Clock } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type ComingSoonSectionProps = {
  id: string
  title: string
  description?: string
  className?: string
}

export function ComingSoonSection({
  id,
  title,
  description,
  className,
}: ComingSoonSectionProps) {
  return (
    <section
      id={id}
      className={cn('scroll-mt-20 border-t py-16 sm:py-24', className)}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              {description}
            </p>
          ) : null}
          <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border bg-muted/40 px-6 py-10 sm:py-12">
            <Badge variant="secondary" className="uppercase tracking-wide">
              <Clock className="size-3" aria-hidden />
              Coming soon
            </Badge>
            <p className="max-w-sm text-sm text-muted-foreground">
              This section is under development. Check back later for updates.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
