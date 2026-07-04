import { cn } from '@/lib/utils/cn'
import { QUEST_MAP, SKILL_QUEST } from '@/content/werft/questMap'
import {
  BRANCH_LABEL,
  PLACE_BONUS,
  ZONE_LABEL,
  buildingById,
  canBuy,
  canonicalZone,
  isCorrectlyPlaced,
  isPlaced,
  nextCost,
  placedZone,
  zonesFor,
  type Building,
  type GameState,
} from './gameModel'
import { NODE_INFO, ZONE_INFO } from './nodeInfo'
import { effectSummary } from './WerftHud'

// The Werft's overlay panels (extracted from BuildGamePage, FL-0069): the selected-node
// panel, the per-node info box, and the keyboard cheat-sheet.

export function SelectedPanel({
  b,
  cs,
  view,
  onBuy,
  onUnplace,
  onInfo,
  onOpenLesson,
  onClose,
}: {
  b: Building
  cs: GameState
  view: 'tree' | 'map'
  onBuy: () => void
  onUnplace: () => void
  onInfo: () => void
  onOpenLesson: (nodeId: string) => void
  onClose: () => void
}) {
  const lvl = cs.levels[b.id] ?? 0
  const cost = nextCost(cs, b)
  const check = canBuy(cs, b)
  const isCharter = b.id === 'charter'
  const owned = lvl >= 1
  const placed = isPlaced(cs, b.id)
  const zone = placedZone(cs, b.id)
  const correct = isCorrectlyPlaced(cs, b.id)
  const questNode = isCharter ? undefined : SKILL_QUEST[b.id]
  const questLocked = !!questNode && !cs.learned.includes(b.id)
  return (
    <div className="flex flex-col gap-1.5 border border-deck-border bg-deck-surface p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-white">
            {b.name}
            <span className="ml-1.5 font-typer text-[10px] text-deck-muted">
              {isCharter ? `Tier ${lvl}` : `Lv ${lvl}/${b.maxLevel}`}
            </span>
          </p>
          <p className="mt-0.5 text-[12px] leading-snug text-deck-muted">{b.blurb}</p>
          {b.requires && b.requires.length > 0 && (
            <p className="mt-1 font-typer text-[10px] text-deck-muted">
              Braucht:{' '}
              {b.requires
                .map((r) => `${buildingById(r)?.name ?? r}${(cs.levels[r] ?? 0) >= 1 ? ' ✓' : ' ○'}`)
                .join(' · ')}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" onClick={onInfo} className="border border-deck-border-dim px-1.5 py-0.5 font-typer text-[10px] uppercase text-deck-muted hover:border-white hover:text-white">
            ℹ Info
          </button>
          <button type="button" onClick={onClose} className="font-typer text-deck-muted hover:text-white">
            ✕
          </button>
        </div>
      </div>
      {questLocked && (
        <div className="flex flex-col items-start gap-1.5 border-l-2 border-deck-warning pl-2">
          <p className="font-typer text-[11px] leading-snug text-deck-warning">
            🔒 Quest nötig: „{QUEST_MAP[questNode!].title}" abschließen, um diesen Skill freizuschalten (+Budget).
          </p>
          <button
            type="button"
            onClick={() => onOpenLesson(questNode!)}
            className="border border-deck-warning px-2 py-1 font-typer text-[10px] uppercase text-deck-warning hover:bg-deck-warning hover:text-black"
          >
            Zur Lektion →
          </button>
        </div>
      )}
      <div className="flex items-center justify-between gap-2">
        <span className="font-typer text-[11px] text-deck-muted">
          {cost == null ? 'maximal ausgebaut' : check.ok ? `Nächstes Level: ${effectSummary(b)}` : check.reason}
        </span>
        {cost != null && (
          <button
            type="button"
            onClick={onBuy}
            disabled={!check.ok}
            className={cn(
              'border px-3 py-1.5 font-typer text-[11px] uppercase transition-colors',
              check.ok ? 'border-white text-white hover:bg-white hover:text-black' : 'border-deck-border-dim text-deck-muted',
            )}
          >
            {isCharter ? 'Ausbauen' : 'Bauen'} · {cost} €
          </button>
        )}
      </div>
      {view === 'map' && !isCharter && owned && (
        <div className="flex items-center justify-between gap-2 border-t border-deck-border-dim pt-1.5">
          <span className="font-typer text-[11px]">
            {!placed ? (
              <span className="text-deck-warning">○ Im Lager — in eine Phase ziehen (+{PLACE_BONUS})</span>
            ) : correct ? (
              <span className="text-deck-success">✓ Richtige Phase: {ZONE_LABEL[zone!]}</span>
            ) : (
              <span className="text-deck-danger">✗ Falsche Phase — „Info" zeigt wohin</span>
            )}
          </span>
          {placed && (
            <button type="button" onClick={onUnplace} className="shrink-0 border border-deck-border-dim px-2 py-1 font-typer text-[10px] uppercase text-deck-muted hover:border-white hover:text-white">
              Ins Lager
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// Full per-node info — opened from a node's panel. The placement LESSON lives HERE so the map stays
// clean. Click the backdrop to dismiss.
export function InfoBox({ b, cs, onClose }: { b: Building; cs: GameState; onClose: () => void }) {
  const isCharter = b.id === 'charter'
  const lvl = cs.levels[b.id] ?? 0
  const placed = isPlaced(cs, b.id)
  const zone = placedZone(cs, b.id)
  const correct = isCorrectlyPlaced(cs, b.id)
  const canon = isCharter ? null : canonicalZone(b.id)
  return (
    <div className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="max-h-[82%] w-[min(460px,94vw)] overflow-y-auto border border-deck-border bg-deck-bg p-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-white">{b.name}</h3>
            <p className="font-typer text-[10px] uppercase tracking-wide text-deck-muted">{BRANCH_LABEL[b.branch]}</p>
          </div>
          <button type="button" onClick={onClose} className="font-typer text-deck-muted hover:text-white">✕</button>
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-deck-muted">{NODE_INFO[b.id] ?? b.blurb}</p>
        <dl className="mt-3 flex flex-col gap-1 border-t border-deck-border-dim pt-2 font-typer text-[11px]">
          <InfoRow k="Effekt / Level" v={effectSummary(b)} />
          <InfoRow k={isCharter ? 'Tier' : 'Level'} v={`${lvl} / ${b.maxLevel}`} />
          {b.requires && b.requires.length > 0 && (
            <InfoRow k="Braucht" v={b.requires.map((r) => `${buildingById(r)?.name ?? r}${(cs.levels[r] ?? 0) >= 1 ? ' ✓' : ' ○'}`).join(' · ')} />
          )}
          {!isCharter && <InfoRow k="Richtige Phase" v={zonesFor(b.id).map((z) => ZONE_LABEL[z]).join(' / ')} />}
        </dl>
        {!isCharter && canon && (
          <div className="mt-3 border-l-2 border-deck-accent pl-2.5">
            <p className="font-typer text-[10px] uppercase tracking-wide text-deck-muted">Phase · {ZONE_LABEL[canon]}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-white">{ZONE_INFO[canon]}</p>
            {placed && (
              <p className={cn('mt-1.5 font-typer text-[10px] uppercase', correct ? 'text-deck-success' : 'text-deck-danger')}>
                {correct ? `✓ steht richtig (${ZONE_LABEL[zone!]})` : `✗ steht in ${ZONE_LABEL[zone!]} — verschieb es dorthin`}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function InfoRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="shrink-0 text-deck-muted">{k}</dt>
      <dd className="text-right text-white">{v}</dd>
    </div>
  )
}

// Keyboard cheat-sheet (toggled with H / ?).
export function KeyHelp({ onClose }: { onClose: () => void }) {
  const rows: [string, string][] = [
    ['F', 'Ansicht umschalten (Shop ↔ Karte)'],
    ['Q · E', 'Auswahl: voriger · nächster Node'],
    ['Leertaste', 'Bauen (Node gewählt) · sonst Zeit Play/Pause'],
    ['W A S D / Pfeile', 'Karte bewegen (Pan)'],
    ['Shift + Bewegung', 'Zoomen (rein / raus)'],
    ['W A S D (Node, Shop)', 'Auswahl räumlich bewegen'],
    ['W A S D (Node, Karte)', 'Phase des Nodes verschieben'],
    ['Tab', 'Node durchschalten (Shift = rückwärts)'],
    ['C', 'Details auf/zu — dann W/S scrollen'],
    ['J', 'Quests öffnen/schließen'],
    ['X', 'Node aus der Karte ins Lager'],
    ['T', 'Info zum gewählten Node'],
    ['R', 'Release ausliefern'],
    ['H · ?', 'Diese Hilfe'],
    ['Esc', 'Schließen / abwählen'],
  ]
  return (
    <div className="pointer-events-auto absolute inset-0 z-40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="max-h-[84%] w-[min(440px,94vw)] overflow-y-auto border border-deck-border bg-deck-bg p-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">Tastatur</h3>
          <button type="button" onClick={onClose} className="font-typer text-deck-muted hover:text-white">✕</button>
        </div>
        <dl className="mt-3 flex flex-col gap-1.5 font-typer text-[11px]">
          {rows.map(([key, what]) => (
            <div key={key} className="flex items-baseline justify-between gap-4">
              <dt className="shrink-0 text-white">{key}</dt>
              <dd className="text-right text-deck-muted">{what}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
