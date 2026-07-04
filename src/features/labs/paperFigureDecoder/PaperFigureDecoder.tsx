import { ScoreMeter } from '@/components/visuals'
import type { InteractionEngineProps } from '@/features/labs/interactionModel'
import { StationConfigBoard } from '../stationConfig/StationConfigBoard'
import type { FigureScenarioData } from './types'
import { selectPfdFeedback } from './scoring'

// Paper Figure Decoder engine (INT-PAPER-FIGURE-DECODER): binds the shared station-
// config board to a figure RECREATED from ScoreMeters (no copied paper image, PH-704)
// plus the decode decisions. Deterministic + mobile-safe (VR-0001 N/A).
export function PaperFigureDecoder({
  scenario,
  onComplete,
}: InteractionEngineProps<FigureScenarioData>) {
  const data = scenario.scenarioData
  const figure = (
    <figure className="flex flex-col gap-2 rounded-xl border border-deck-border bg-deck-surface-2 p-3">
      <div className="flex flex-col gap-2">
        {data.bars.map((bar) => (
          <ScoreMeter
            key={bar.id}
            id={`pfd-${bar.id}`}
            label={bar.label}
            value={bar.value}
            max={bar.max}
            interpretation="quality"
          />
        ))}
      </div>
      <figcaption className="text-[11px] text-deck-muted">{data.caption}</figcaption>
    </figure>
  )
  return (
    <StationConfigBoard
      scenario={scenario}
      intro={figure}
      profile={[{ term: 'Quelle', detail: data.source }]}
      stations={data.stations}
      meterLabel="Decode-Fit"
      evaluateLabel="Figure auswerten"
      selectFeedback={selectPfdFeedback}
      onComplete={onComplete}
    />
  )
}
