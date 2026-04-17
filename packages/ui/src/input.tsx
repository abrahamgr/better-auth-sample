import type { InputHTMLAttributes } from 'react'

import { cn } from './lib/cn'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        'min-h-12 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-sm text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[color-mix(in_oklab,var(--color-accent)_18%,white)]',
        className,
      )}
      {...props}
    />
  )
}
