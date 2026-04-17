import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from './lib/cn'

export function Container({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function SectionHeading({
  eyebrow,
  description,
  title,
}: {
  description?: ReactNode
  eyebrow?: ReactNode
  title: ReactNode
}) {
  return (
    <div className="space-y-3">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance text-[var(--color-ink)] sm:text-5xl">
        {title}
      </h1>
      {description ? (
        <p className="max-w-2xl text-base leading-7 text-[var(--color-muted)]">
          {description}
        </p>
      ) : null}
    </div>
  )
}
