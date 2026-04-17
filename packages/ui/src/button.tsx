import type { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from './lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-ink)] text-[var(--color-surface)] shadow-[0_14px_30px_rgba(15,23,42,0.16)] hover:bg-[var(--color-ink-soft)]',
  secondary:
    'bg-[var(--color-surface)] text-[var(--color-ink)] ring-1 ring-[var(--color-border)] hover:bg-[var(--color-surface-muted)]',
  ghost:
    'bg-transparent text-[var(--color-ink)] hover:bg-[color-mix(in_oklab,var(--color-ink)_8%,white)]',
  danger:
    'bg-[var(--color-danger)] text-white shadow-[0_14px_30px_rgba(185,28,28,0.18)] hover:bg-[color-mix(in_oklab,var(--color-danger)_86%,black)]',
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: ButtonVariant
}

export function Button({
  children,
  className,
  type = 'button',
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        className,
      )}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}
