import type { HTMLAttributes, ReactNode } from 'react'

import { cn } from './lib/cn'

export function Card({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-[2rem] border border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-surface)_92%,white)] p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn('text-2xl font-semibold tracking-tight', className)}
      {...props}
    >
      {children}
    </h2>
  )
}

export function CardDescription({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-sm text-[var(--color-muted)]', className)}
      {...props}
    >
      {children}
    </p>
  )
}

export function CardContent({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-6 space-y-5', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-6 flex flex-wrap gap-3', className)} {...props}>
      {children}
    </div>
  )
}

export function StatCard({
  label,
  value,
  hint,
}: {
  hint?: string
  label: string
  value: ReactNode
}) {
  return (
    <Card className="space-y-2 p-5">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-[var(--color-muted)]">
        {label}
      </p>
      <div className="text-xl font-semibold text-[var(--color-ink)]">
        {value}
      </div>
      {hint ? (
        <p className="text-sm text-[var(--color-muted)]">{hint}</p>
      ) : null}
    </Card>
  )
}
