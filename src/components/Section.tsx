import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

type SectionProps = {
  id: string
  title: string
  description?: string
  className?: string
  children?: ReactNode
}

export function Section({
  id,
  title,
  description,
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn('scroll-mt-20 border-t py-16 sm:py-24', className)}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-center text-2xl font-semibold tracking-tight sm:text-3xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-3 text-center text-base text-muted-foreground sm:text-lg">
              {description}
            </p>
          ) : null}
          {children ? <div className="mt-10">{children}</div> : null}
        </div>
      </div>
    </section>
  )
}
