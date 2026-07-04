import type { ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'
import {
  RELEASE_EVERY,
  architectureScore,
  builtCount,
  isMature,
  releaseDefense,
  releaseThreat,
  tierCapped,
  tierOf,
  type Building,
  type GameState,
  type Stat,
} from './gameModel'

// Small presentational HUD pieces + the coach line for the Werft (extracted from
// BuildGamePage, FL-0069). No state — everything renders from GameState/props.

export const STAT_LABEL: Record<Stat, string> = {
  quality: 'Qualität',
  security: 'Sicherheit',
  velocity: 'Tempo',
  resilience: 'Resilienz',
}
const SHORT_STAT: Record<Stat, string> = { quality: 'Qual', security: 'Sich', velocity: 'Tempo', resilience: 'Res' }
export const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

export function Toggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex-1 border px-3 py-1.5 font-typer text-[11px] uppercase tracking-wide transition-colors',
        active ? 'border-white bg-white text-black' : 'border-deck-border-dim text-deck-muted hover:border-white hover:text-white',
      )}
    >
      {children}
    </button>
  )
}

// Clock control (pause / play / fast-forward).
export function TimeBtn({ active, onClick, label, children }: { active: boolean; onClick: () => void; label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn('px-2 py-1.5 font-typer text-[11px] leading-none transition-colors', active ? 'bg-white text-black' : 'text-deck-muted hover:text-white')}
    >
      {children}
    </button>
  )
}

// A titled dashboard card — the single block primitive the Werft HUD is built from.
export function Block({ title, children, className }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={cn('flex flex-col gap-1.5 border border-deck-border p-2.5', className)}>
      {title && <h2 className="font-typer text-[10px] uppercase tracking-widest text-deck-muted">{title}</h2>}
      {children}
    </section>
  )
}

// A dynamic next-step coach so the first steps — and how to keep progressing — are always obvious.
export function coachLine(cs: GameState): string {
  if (isMature(cs))
    return '🏆 System ausgereift — Charter auf Max-Tier und 5 saubere Releases. Spiel weiter, mach Prestige, oder starte ein neues System.'
  const def = releaseDefense(cs)
  const thr = releaseThreat(cs)
  if (builtCount(cs) < 3)
    return 'Drück ▶ (unten in der Leiste), damit die Zeit läuft — Budget kommt automatisch. Kauf im „Shop" 3 Skills mit hellem Rahmen.'
  if (cs.learned.length === 0)
    return 'Die meisten Skills sind hinter Quests (🔒). Öffne „Quests" (Knopf oben oder Taste J) und schließe eine Lektion ab — das gibt Budget UND schaltet ihren Skill frei.'
  if (Object.keys(cs.placed).length === 0)
    return 'Wechsel auf „Karte" und zieh einen Skill aus dem Lager in die passende Phase (Grenze→Wissen→Modell→Tools→Prüfung→Betrieb). Richtige Phase = ✓ + Bonus.'
  const arch = architectureScore(cs)
  if (arch.placed > 0 && arch.correct < arch.placed)
    return 'Ein Skill steht falsch (✗). Tipp ihn an und drück „ℹ Info" — da steht, in welche Phase er gehört. Nur richtig platzierte geben den Bonus.'
  if (tierCapped(cs))
    return `Alles für Tier ${tierOf(cs)} ist gebaut. Lass die Zeit laufen für Budget, dann „Projekt-Charter" antippen + ausbauen → Tier ${tierOf(cs) + 1} schaltet tiefere Skills frei.`
  if (def < thr)
    return `Abwehr ${def} < Bedrohung ${thr}. Bau Skills + Docs (mit Docs sinkt Drift über die Zeit). Alle ${RELEASE_EVERY} Tage liefert das System selbst aus — sorg dafür, dass Abwehr ≥ Bedrohung ist.`
  return `Abwehr ${def} ≥ Bedrohung ${thr} — gut. Halt es so, sammle/­wehre Event-Bubbles ab und steig im Tier auf.`
}

const VAR_LABEL: Record<string, string> = { drift: 'Drift', debt: 'Debt', scale: 'Skala-Last' }
export function effectSummary(b: Building): string {
  const parts: string[] = []
  for (const [k, v] of Object.entries(b.effect)) parts.push(`+${v} ${SHORT_STAT[k as Stat]}`)
  for (const [k, v] of Object.entries(b.resist ?? {})) parts.push(`−${v} ${VAR_LABEL[k]}`)
  return parts.join(' · ')
}

export function Kpi({ label, value, big, tone }: { label: string; value: string; big?: boolean; tone?: 'good' | 'warn' }) {
  return (
    <div className="flex flex-col">
      <span className="text-[9px] uppercase tracking-wide text-deck-muted">{label}</span>
      <span
        className={cn(
          'tabular-nums',
          big ? 'text-lg font-bold' : 'text-sm',
          tone === 'good' ? 'text-deck-success' : tone === 'warn' ? 'text-deck-warning' : 'text-white',
        )}
      >
        {value}
      </span>
    </div>
  )
}

export function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between font-typer text-[10px] uppercase tracking-wide text-deck-muted">
        <span>{label}</span>
        <span className="tabular-nums text-white">{value}</span>
      </div>
      <div className="h-1.5 border border-deck-border-dim">
        <div className="h-full bg-white" style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  )
}

// World variables: drift/debt are bad (red when high), trust is good, scale just grows.
export function VarBar({ label, value, tone }: { label: string; value: number; tone: 'bad' | 'good' | 'neutral' }) {
  const danger = tone === 'bad' && value >= 45
  const good = tone === 'good'
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center justify-between font-typer text-[9px] uppercase tracking-wide text-deck-muted">
        <span>{label}</span>
        <span className={cn('tabular-nums', danger ? 'text-deck-danger' : good ? 'text-deck-success' : 'text-white')}>{value}</span>
      </div>
      <div className="h-1 border border-deck-border-dim">
        <div
          className={cn('h-full', danger ? 'bg-deck-danger' : good ? 'bg-deck-success' : 'bg-white')}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  )
}
