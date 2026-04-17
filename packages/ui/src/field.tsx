import type { HTMLAttributes, LabelHTMLAttributes, ReactNode } from 'react'

import { cn } from './lib/cn'

export function Field({
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

export function FieldLabel({
  children,
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: high order component
    <label
      className={cn('text-sm font-medium text-[var(--color-ink)]', className)}
      {...props}
    >
      {children}
    </label>
  )
}

export function FieldHint({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('text-xs text-[var(--color-muted)]', className)}
      {...props}
    >
      {children}
    </p>
  )
}

export function FieldError({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  if (!children) {
    return null
  }

  return (
    <p
      className={cn(
        'text-sm font-medium text-[var(--color-danger)]',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  )
}

export function InlineMessage({
  children,
  className,
  tone = 'neutral',
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  tone?: 'danger' | 'neutral' | 'success'
}) {
  const toneClass =
    tone === 'danger'
      ? 'border-[color-mix(in_oklab,var(--color-danger)_20%,white)] bg-[color-mix(in_oklab,var(--color-danger)_8%,white)] text-[var(--color-danger)]'
      : tone === 'success'
        ? 'border-[color-mix(in_oklab,var(--color-success)_25%,white)] bg-[color-mix(in_oklab,var(--color-success)_10%,white)] text-[var(--color-success)]'
        : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]'

  return (
    <div
      className={cn(
        'rounded-2xl border px-4 py-3 text-sm',
        toneClass,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
