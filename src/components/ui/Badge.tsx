import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

type Tone = 'neutral' | 'success' | 'current' | 'warning' | 'danger' | 'locked'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone
}

// Small status chip — sharp, border + text only (no fills; VSS-101: colour is
// rare and thin). Tone conveys meaning together with its text label, never colour
// alone.
const tones: Record<Tone, string> = {
  neutral: 'border-deck-border-dim text-deck-muted',
  success: 'border-deck-success text-deck-success',
  current: 'border-deck-current text-white',
  warning: 'border-deck-warning text-deck-warning',
  danger: 'border-deck-danger text-deck-danger',
  locked: 'border-deck-locked text-deck-locked',
}

export function Badge({ tone = 'neutral', className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-deck border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider',
        tones[tone],
        className,
      )}
      {...rest}
    />
  )
}
