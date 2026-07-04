import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'
import {
  applyOption,
  canAfford,
  nextStageIndex,
  scorecard,
  type CampaignDef,
  type CampaignState,
  type Meter,
  type StageOption,
} from './campaignModel'

// The Build Campaign engine: you direct ONE whole product end-to-end. A persistent HUD shows
// your meters + oversight; each decision moves them, spends attention and sets flags; early
// choices change which incident fires and the final scorecard. Brutalist, tap-first, mobile.
export function BuildCampaign({
  def,
  onComplete,
}: {
  def: CampaignDef
  onComplete: () => void
}) {
  const [cs, setCs] = useState<CampaignState>(def.initial)
  const [idx, setIdx] = useState(() => nextStageIndex(def, 0, def.initial.flags))
  const [picked, setPicked] = useState<StageOption | null>(null)
  const [done, setDone] = useState(false)
  const firedRef = useState({ v: false })[0]

  const stage = idx >= 0 ? def.stages[idx] : null

  const choose = (opt: StageOption) => {
    if (picked || !canAfford(cs, opt)) return
    setCs((s) => applyOption(s, opt))
    setPicked(opt)
  }
  const advance = () => {
    const next = nextStageIndex(def, idx + 1, cs.flags)
    if (next < 0) {
      setDone(true)
    } else {
      setIdx(next)
      setPicked(null)
    }
  }

  if (done) {
    const card = scorecard(def, cs)
    return (
      <div className="flex flex-col gap-3 border border-deck-border bg-deck-surface p-3">
        <Hud cs={cs} />
        <div className="flex items-center gap-3 border border-deck-border p-3">
          <span className="font-typer text-5xl font-bold leading-none text-white">{card.letter}</span>
          <p className="text-[13px] text-white">{card.verdict}</p>
        </div>
        <div className="flex flex-col gap-1.5">
          {card.lines.map((l, i) => (
            <div
              key={i}
              className={cn(
                'border-l-2 pl-2 text-[12px]',
                l.tone === 'good' ? 'border-deck-success text-deck-success' : 'border-deck-danger text-deck-danger',
              )}
            >
              <span className="text-white">{l.tone === 'good' ? '✓ ' : '✗ '}</span>
              {l.text}
            </div>
          ))}
        </div>
        <Button
          onClick={() => {
            if (firedRef.v) return
            firedRef.v = true
            onComplete()
          }}
        >
          Abschließen
        </Button>
      </div>
    )
  }

  if (!stage) return null
  const total = def.stages.length

  return (
    <div className="flex flex-col gap-3 border border-deck-border bg-deck-surface p-3">
      <Hud cs={cs} />

      <div className="flex items-center justify-between font-typer text-[10px] uppercase tracking-widest text-deck-muted">
        <span>{stage.phase}</span>
        <span>Schritt {idx + 1}/{total}</span>
      </div>
      <div className="flex items-start gap-2">
        <span aria-hidden className="mt-[5px] h-2 w-2 shrink-0 bg-white" />
        <div>
          <p className="text-sm font-semibold text-white">{stage.title}</p>
          <p className="mt-0.5 text-[13px] leading-relaxed text-deck-muted">{stage.brief}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {stage.options.map((o) => {
          const isPick = picked?.id === o.id
          const afford = canAfford(cs, o)
          return (
            <button
              key={o.id}
              type="button"
              disabled={picked != null || !afford}
              onClick={() => choose(o)}
              className={cn(
                'border px-3 py-2 text-left text-[13px] transition-colors',
                !picked && afford && 'border-deck-border-dim text-white hover:border-white',
                !picked && !afford && 'border-deck-border-dim text-deck-muted opacity-50',
                isPick && 'border-white bg-white text-black',
                picked && !isPick && 'border-deck-border-dim text-deck-muted',
              )}
            >
              <span className="flex items-center justify-between gap-2">
                <span>{o.label}</span>
                {o.cost ? (
                  <span className="shrink-0 font-typer text-[10px] uppercase text-deck-muted">
                    −{o.cost} Aufsicht{!afford && ' · zu wenig'}
                  </span>
                ) : null}
              </span>
              {o.detail && <span className="mt-0.5 block text-[11px] text-deck-muted">{o.detail}</span>}
            </button>
          )
        })}
      </div>

      {picked && (
        <>
          <div className="border-l-2 border-deck-accent pl-2.5">
            <p className="py-1 text-[12px] text-deck-muted">
              {picked.ideal && <span className="text-deck-success">Starker Zug. </span>}
              {picked.feedback}
            </p>
          </div>
          <Button onClick={advance}>Weiter</Button>
        </>
      )}
    </div>
  )
}

const METERS: { key: Meter | 'oversight'; label: string }[] = [
  { key: 'quality', label: 'Qualität' },
  { key: 'security', label: 'Sicherheit' },
  { key: 'scope', label: 'Umfang' },
  { key: 'oversight', label: 'Aufsicht' },
]

function Hud({ cs }: { cs: CampaignState }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {METERS.map((m) => {
        const value = cs[m.key]
        const critical = (m.key === 'quality' || m.key === 'security') && value < 45
        return (
          <div key={m.key} className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between font-typer text-[10px] uppercase tracking-wide text-deck-muted">
              <span>{m.label}</span>
              <span className={cn('tabular-nums', critical ? 'text-deck-danger' : 'text-white')}>{value}</span>
            </div>
            <div className={cn('h-1.5 border', critical ? 'border-deck-danger' : 'border-deck-border-dim')}>
              <div
                className={cn('h-full', critical ? 'bg-deck-danger' : 'bg-white')}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
