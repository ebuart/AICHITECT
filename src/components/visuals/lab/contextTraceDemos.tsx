import { TokenBudgetBar, TraceTimeline } from '@/components/visuals'
import type { TokenBudgetSegment, TraceEvent } from '@/components/visuals'
import { VisualLabCase } from './VisualLabCase'

const SEGMENTS: TokenBudgetSegment[] = [
  { id: 'sys', label: 'System Prompt', tokens: 1200 },
  { id: 'task', label: 'Task', tokens: 800, state: 'selected' },
  { id: 'hist', label: 'History', tokens: 2600, state: 'warning' },
  { id: 'ret', label: 'Retrieved', tokens: 1800 },
  { id: 'ans', label: 'Answer', tokens: 600 },
]

export function TokenBudgetBarDemo() {
  return (
    <div className="flex flex-col gap-2">
      <VisualLabCase id="TB-under" componentName="TokenBudgetBar" testState="short" notes="under budget, segment legend">
        <TokenBudgetBar usedTokens={7000} maxTokens={16000} segments={SEGMENTS} />
      </VisualLabCase>

      <VisualLabCase id="TB-over" componentName="TokenBudgetBar" testState="warning" notes="over budget → Überlauf, numbers shown">
        <TokenBudgetBar
          usedTokens={18200}
          maxTokens={16000}
          segments={[...SEGMENTS, { id: 'noise', label: 'Stale Logs', tokens: 11200, state: 'excluded' }]}
          noiseRisk={0.8}
          missingContextRisk={0.2}
        />
      </VisualLabCase>

      <VisualLabCase id="TB-compact" componentName="TokenBudgetBar" testState="dense" notes="compact: bar + numbers only">
        <TokenBudgetBar usedTokens={9000} maxTokens={16000} segments={SEGMENTS} compact />
      </VisualLabCase>
    </div>
  )
}

const THREE_EVENTS: TraceEvent[] = [
  { id: 'e1', step: 1, actor: 'User', title: 'Anfrage gestellt', detail: 'Erstelle einen Quartalsbericht.', tags: ['input'] },
  { id: 'e2', step: 2, actor: 'Agent', title: 'Falsches Tool gewählt', detail: 'delete_file statt read_file aufgerufen.', state: 'failure_origin', tags: ['tool_call'] },
  { id: 'e3', step: 3, actor: 'System', title: 'Leere Antwort', detail: 'Symptom des früheren Fehlers.', state: 'symptom', tags: ['output'] },
]

const TEN_EVENTS: TraceEvent[] = Array.from({ length: 10 }, (_, i) => ({
  id: `t${i}`,
  step: i + 1,
  actor: ['User', 'Agent', 'Tool', 'Eval'][i % 4],
  title: `Event ${i + 1}`,
  state: i === 4 ? 'failure_origin' : i === 7 ? 'symptom' : 'default',
}))

export function TraceTimelineDemo() {
  return (
    <div className="flex flex-col gap-2">
      <VisualLabCase id="TT-3" componentName="TraceTimeline" testState="short" notes="3 events, failure_origin vs symptom distinct, selected">
        <TraceTimeline events={THREE_EVENTS} selectedEventId="e2" />
      </VisualLabCase>
      <VisualLabCase id="TT-10" componentName="TraceTimeline" testState="dense" notes="10 events, actor variety, mobile column">
        <TraceTimeline events={TEN_EVENTS} compact />
      </VisualLabCase>
      <VisualLabCase id="TT-empty" componentName="TraceTimeline" testState="empty" notes="empty state">
        <TraceTimeline events={[]} />
      </VisualLabCase>
    </div>
  )
}
