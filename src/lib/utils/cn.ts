// Minimal className combiner. Falsy entries are dropped. No dependency on
// clsx/tailwind-merge yet — kept tiny until duplication justifies more.
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
