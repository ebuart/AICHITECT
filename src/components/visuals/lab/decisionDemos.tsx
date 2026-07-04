import {
  DecisionCard,
  FailureModeCard,
  ScoreMeter,
  CompactFallbackView,
} from '@/components/visuals'
import type { CompactFallbackItem } from '@/components/visuals'
import { VisualLabCase } from './VisualLabCase'

export function DecisionCardDemo() {
  return (
    <div className="flex flex-col gap-2">
      <VisualLabCase id="DC-choices" componentName="DecisionCard" testState="short" notes="strong / weak / selected, trade-offs">
        <div className="flex flex-col gap-2">
          <DecisionCard
            id="d1"
            title="Workflow (fixed path)"
            description="Vorhersehbar, testbar, günstig."
            tradeoffs={['weniger flexibel', 'mehr Vorab-Design']}
            state="strong_choice"
          />
          <DecisionCard
            id="d2"
            title="Autonomous Agent"
            description="Flexibel, aber teurer und schwerer zu kontrollieren."
            tradeoffs={['Fehler-Aufschaukeln', 'höhere Latenz']}
            state="weak_choice"
          />
        </div>
      </VisualLabCase>

      <VisualLabCase id="DC-disabled" componentName="DecisionCard" testState="warning" notes="disabled with reason; long text clamps">
        <DecisionCard
          id="d3"
          title="Human Approval Gate for Destructive Tool Actions"
          description="Sehr lange Beschreibung, die auf drei Zeilen begrenzt wird, damit das Layout stabil bleibt und nichts überläuft auf schmalen Screens."
          disabledReason="Prerequisite NODE-08-01 noch nicht abgeschlossen."
        />
      </VisualLabCase>
    </div>
  )
}

export function FailureModeCardDemo() {
  return (
    <div className="flex flex-col gap-2">
      <VisualLabCase id="FM-kinds" componentName="FailureModeCard" testState="short" notes="symptom / root_cause / repair_rule / distractor / risk + layer">
        <div className="flex flex-col gap-2">
          <FailureModeCard id="f1" kind="symptom" layer="product" label="Antwort ist leer" explanation="Sichtbares Symptom." />
          <FailureModeCard id="f2" kind="root_cause" layer="tools" label="Falscher Tool-Call" explanation="Eigentliche Fehlerursache." state="failure_origin" />
          <FailureModeCard id="f3" kind="repair_rule" layer="tools" label="Tool-Schema mit enum erzwingen" />
          <FailureModeCard id="f4" kind="distractor" label="Model-Halluzination?" explanation="Plausibel, aber nicht die Ursache." />
          <FailureModeCard id="f5" kind="risk" layer="security" label="Broad tool permission" />
        </div>
      </VisualLabCase>
    </div>
  )
}

export function ScoreMeterDemo() {
  return (
    <div className="flex flex-col gap-2">
      <VisualLabCase id="SM-grid" componentName="ScoreMeter" testState="short" notes="risk/mastery/coverage/quality, low/mid/high">
        <div className="grid grid-cols-1 gap-2">
          <ScoreMeter id="m1" label="Prompt-Injection-Risk" value={8} max={10} interpretation="risk" />
          <ScoreMeter id="m2" label="Context Engineering" value={7} max={10} interpretation="mastery" />
          <ScoreMeter id="m3" label="Concept Coverage" value={4} max={10} interpretation="coverage" />
          <ScoreMeter id="m4" label="Eval Quality" value={9} max={10} interpretation="quality" />
        </div>
      </VisualLabCase>
      <VisualLabCase id="SM-compact" componentName="ScoreMeter" testState="dense" notes="compact, no numeric tail">
        <ScoreMeter id="m5" label="Mastery" value={5} max={10} interpretation="mastery" compact />
      </VisualLabCase>
    </div>
  )
}

const ITEMS: CompactFallbackItem[] = [
  { id: 'i1', label: 'Model erhält Anfrage', detail: 'Eingang' },
  { id: 'i2', label: 'Falsches Tool gewählt', detail: 'Hier liegt die Ursache.', state: 'failure_origin' },
  { id: 'i3', label: 'Tool schlägt fehl', state: 'warning' },
  { id: 'i4', label: 'Antwort leer', detail: 'Symptom', state: 'symptom' },
]

export function CompactFallbackViewDemo() {
  return (
    <div className="flex flex-col gap-2">
      <VisualLabCase id="CF-4" componentName="CompactFallbackView" testState="fallback" notes="4 items incl. warning + failure states">
        <CompactFallbackView
          title="Trace (Kompakt)"
          summary="Fallback für das Trace-Diagramm auf schmalen Screens."
          items={ITEMS}
        />
      </VisualLabCase>
      <VisualLabCase id="CF-10" componentName="CompactFallbackView" testState="dense" notes="10 items, mobile">
        <CompactFallbackView
          title="Pipeline-Stufen"
          summary="Lange Liste bleibt lesbar."
          items={Array.from({ length: 10 }, (_, i) => ({ id: `p${i}`, label: `Stufe ${i + 1}` }))}
        />
      </VisualLabCase>
    </div>
  )
}
