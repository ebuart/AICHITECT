import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

// Soft surface card (PC-060 iOS-soft). Composable layout primitive.
export function Card({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-deck border border-deck-border bg-deck-surface p-4',
        className,
      )}
      {...rest}
    />
  )
}
