import {
  SystemNode,
  SystemEdge,
  LayerStack,
  FlowStep,
  BoundaryBox,
} from '@/components/visuals'
import type { LayerStackLayer } from '@/components/visuals'
import type { SystemEdgeKind, SystemNodeKind } from '@/types/visual'
import { VisualLabCase } from './VisualLabCase'

const ALL_KINDS: SystemNodeKind[] = [
  'model', 'agent', 'subagent', 'tool', 'retrieval', 'memory',
  'eval', 'human', 'guardrail', 'repo', 'workflow', 'storage',
]

const LONG_LABEL = 'Contextual Retrieval with Reranking and Source Grounding'

export function SystemNodeDemo() {
  return (
    <div className="flex flex-col gap-2">
      <VisualLabCase id="SN-short" componentName="SystemNode" testState="short" notes="all 12 kinds, short labels">
        <div className="grid grid-cols-2 gap-2">
          {ALL_KINDS.map((kind) => (
            <SystemNode key={kind} id={kind} kind={kind} label={kind} compact />
          ))}
        </div>
      </VisualLabCase>

      <VisualLabCase id="SN-long" componentName="SystemNode" testState="long_labels" notes="long label truncates; badge overflow +N">
        <SystemNode
          id="long"
          kind="retrieval"
          label={LONG_LABEL}
          layer="retrieval"
          badges={['hybrid', 'rerank', 'grounding', 'bm25', 'dense']}
          description="Lange Beschreibung wird auf zwei Zeilen begrenzt und sauber abgeschnitten."
        />
      </VisualLabCase>

      <VisualLabCase id="SN-states" componentName="SystemNode" testState="warning" notes="selected / warning / disabled / completed">
        <div className="grid grid-cols-2 gap-2">
          <SystemNode id="s1" kind="agent" label="Agent" state="selected" />
          <SystemNode id="s2" kind="tool" label="Tool" state="warning" />
          <SystemNode id="s3" kind="tool" label="Disabled Tool" state="disabled" />
          <SystemNode id="s4" kind="eval" label="Eval" state="completed" />
        </div>
      </VisualLabCase>

      <VisualLabCase id="SN-dense" componentName="SystemNode" testState="dense" notes="8+ node board, mobile width">
        <div className="grid grid-cols-2 gap-2">
          {ALL_KINDS.slice(0, 8).map((kind, i) => (
            <SystemNode key={kind} id={`d${i}`} kind={kind} label={`${kind} ${i + 1}`} compact />
          ))}
        </div>
      </VisualLabCase>
    </div>
  )
}

const EDGE_KINDS: SystemEdgeKind[] = [
  'data', 'control', 'tool_call', 'retrieval', 'memory_write', 'eval_feedback', 'approval', 'risk',
]

export function SystemEdgeDemo() {
  return (
    <div className="flex flex-col gap-2">
      <VisualLabCase id="SE-all" componentName="SystemEdge" testState="short" notes="all kinds as connection list (mobile-safe)">
        <div className="flex flex-col gap-1.5">
          {EDGE_KINDS.map((kind) => (
            <SystemEdge key={kind} id={kind} from="Model" to="Tool" kind={kind} label={kind} />
          ))}
        </div>
      </VisualLabCase>

      <VisualLabCase id="SE-risk" componentName="SystemEdge" testState="warning" notes="risk + approval edges expose Details access">
        <div className="flex flex-col gap-1.5">
          <SystemEdge id="r1" from="Untrusted Doc" to="Agent" kind="risk" label="prompt injection path" state="failure_origin" />
          <SystemEdge id="a1" from="Agent" to="Deploy" kind="approval" label="human approval" direction="two_way" />
        </div>
      </VisualLabCase>

      <VisualLabCase id="SE-nolabel" componentName="SystemEdge" testState="short" notes="no label, direction only">
        <SystemEdge id="n1" from="A" to="B" kind="data" />
      </VisualLabCase>
    </div>
  )
}

const EIGHT_LAYERS: LayerStackLayer[] = [
  { id: 'product', label: 'User / Product Goal', role: 'Was der User erreichen will.' },
  { id: 'app_logic', label: 'Application Logic', role: 'Deterministische App-Logik.' },
  { id: 'model_control', label: 'Model / Agent Control', role: 'Steuert Calls und Agenten.' },
  { id: 'context', label: 'Context', role: 'Was das Model sieht.', state: 'warning', items: ['budget', 'noise'] },
  { id: 'retrieval', label: 'Retrieval', role: 'Externe Evidenz.' },
  { id: 'tools', label: 'Tools / External Systems', role: 'Aktionen nach außen.' },
  { id: 'evals', label: 'Evals', role: 'Messung der Qualität.' },
  { id: 'security', label: 'Security / Governance', role: 'Grenzen und Approvals.' },
]

export function LayerStackDemo() {
  return (
    <div className="flex flex-col gap-2">
      <VisualLabCase id="LS-8" componentName="LayerStack" testState="dense" notes="8 layers, failure highlight, items">
        <LayerStack layers={EIGHT_LAYERS} highlightedLayerId="context" />
      </VisualLabCase>
      <VisualLabCase id="LS-4" componentName="LayerStack" testState="short" notes="4 layers, compact">
        <LayerStack layers={EIGHT_LAYERS.slice(0, 4)} compact />
      </VisualLabCase>
      <VisualLabCase id="LS-empty" componentName="LayerStack" testState="empty" notes="empty state">
        <LayerStack layers={[]} />
      </VisualLabCase>
    </div>
  )
}

export function FlowStepDemo() {
  return (
    <div className="flex flex-col gap-2">
      <VisualLabCase id="FS-flow" componentName="FlowStep" testState="short" notes="prompt chaining flow: done / current / todo">
        <div>
          <FlowStep index={1} label="Extract" status="done" description="Strukturierte Daten extrahieren." connector />
          <FlowStep index={2} label="Validate" status="current" description="Schema gegen Gate prüfen." connector />
          <FlowStep index={3} label="Generate" status="todo" description="Finale Antwort erzeugen." />
        </div>
      </VisualLabCase>
    </div>
  )
}

export function BoundaryBoxDemo() {
  return (
    <div className="flex flex-col gap-2">
      <VisualLabCase id="BB-trust" componentName="BoundaryBox" testState="short" notes="trust boundary with rules + child node">
        <BoundaryBox id="b1" kind="trust" label="Trust Boundary" rules={['nur signierte Tools', 'kein Zugriff auf Secrets']}>
          <SystemNode id="t1" kind="tool" label="Search Tool" compact />
        </BoundaryBox>
      </VisualLabCase>

      <VisualLabCase id="BB-nested" componentName="BoundaryBox" testState="dense" notes="nested sandbox inside permission boundary, warning">
        <BoundaryBox id="b2" kind="permission" label="Permission Boundary" state="warning">
          <BoundaryBox id="b3" kind="sandbox" label="Sandbox" rules={['read-only FS']}>
            <SystemNode id="t2" kind="agent" label="Worker Agent" compact />
          </BoundaryBox>
        </BoundaryBox>
      </VisualLabCase>
    </div>
  )
}
