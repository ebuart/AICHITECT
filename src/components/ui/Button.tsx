import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

type Variant = 'primary' | 'subtle' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

// Touch-friendly button (min-h-12 ≈ 48px, QG-054/QG-077). Brutalist B/W: sharp
// block, monospace (from the global clickable rule), uppercase tracking. The
// primary action is the inversion — a solid white block with black text.
const variants: Record<Variant, string> = {
  primary: 'border border-white bg-white text-black hover:bg-deck-muted hover:border-deck-muted',
  subtle: 'border border-deck-border bg-deck-bg text-white hover:bg-white hover:text-black',
  ghost: 'border border-transparent text-deck-muted hover:text-white',
}

export function Button({
  variant = 'primary',
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex min-h-12 items-center justify-center gap-2 rounded-deck px-4 text-sm font-semibold uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...rest}
    />
  )
}
