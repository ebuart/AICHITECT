import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ProgressProvider } from '@/features/progress/ProgressContext'
import { LabPage } from '@/features/labs/LabPage'
import { ContextBudgetBoard } from '@/features/labs/contextBudgetBoard/ContextBudgetBoard'
import { FailureModeTree } from '@/features/labs/failureModeTree/FailureModeTree'
import { AgentTraceDebugger } from '@/features/labs/agentTraceDebugger/AgentTraceDebugger'
import { ToolContractForge } from '@/features/labs/toolContractForge/ToolContractForge'
import { ArchitectureBuilder } from '@/features/labs/architectureBuilder/ArchitectureBuilder'
import { RetrievalFactory } from '@/features/labs/retrievalFactory/RetrievalFactory'
import { EvalDesigner } from '@/features/labs/evalDesigner/EvalDesigner'
import { SecurityIncidentRoom } from '@/features/labs/securityIncidentRoom/SecurityIncidentRoom'
import { RepoRefactor } from '@/features/labs/repoRefactor/RepoRefactor'
import { PaperFigureDecoder } from '@/features/labs/paperFigureDecoder/PaperFigureDecoder'
import { CapstoneSimulator } from '@/features/labs/capstoneSimulator/CapstoneSimulator'
import { LayerStackBuilder } from '@/features/labs/layerStackBuilder/LayerStackBuilder'
import { TradeOffDuel } from '@/features/labs/tradeOffDuel/TradeOffDuel'
import { ConstraintPuzzle } from '@/features/labs/constraintPuzzle/ConstraintPuzzle'
import { SystemPostmortem } from '@/features/labs/systemPostmortem/SystemPostmortem'
import { AllocatorBoard } from '@/features/labs/contextAllocator/AllocatorBoard'
import { TrustBoundaryBoard } from '@/features/labs/trustBoundary/TrustBoundaryBoard'
import { IncidentTriageBoard } from '@/features/labs/incidentTriage/IncidentTriageBoard'
import { PipelineBuilderBoard } from '@/features/labs/pipelineBuilder/PipelineBuilderBoard'
import { contextBudgetScenarios } from '@/content/labs/contextBudgetScenarios'
import { failureModeScenarios } from '@/content/labs/failureModeScenarios'
import { agentTraceScenarios } from '@/content/labs/agentTraceScenarios'
import { toolContractScenarios } from '@/content/labs/toolContractScenarios'
import { architectureScenarios } from '@/content/labs/architectureScenarios'
import { retrievalFactoryScenarios } from '@/content/labs/retrievalFactoryScenarios'
import { evalDesignerScenarios } from '@/content/labs/evalDesignerScenarios'
import { securityIncidentScenarios } from '@/content/labs/securityIncidentScenarios'
import { repoRefactorScenarios } from '@/content/labs/repoRefactorScenarios'
import { paperFigureScenarios } from '@/content/labs/paperFigureScenarios'
import { capstoneScenarios } from '@/content/labs/capstoneScenarios'
import { contextAllocatorScenarios } from '@/content/labs/contextAllocatorScenarios'
import { trustBoundaryScenarios } from '@/content/labs/trustBoundaryScenarios'
import { incidentTriageScenarios } from '@/content/labs/incidentTriageScenarios'
import { pipelineScenarios } from '@/content/labs/pipelineScenarios'
import { layerStackScenarios } from '@/content/labs/layerStackScenarios'
import { tradeOffScenarios } from '@/content/labs/tradeOffScenarios'
import { constraintScenarios } from '@/content/labs/constraintScenarios'
import { systemPostmortemScenarios } from '@/content/labs/systemPostmortemScenarios'

describe('interaction engines smoke', () => {
  it('Context Budget Board renders and evaluates without throwing', () => {
    render(
      <ContextBudgetBoard scenario={contextBudgetScenarios[0]} onComplete={vi.fn()} />,
    )
    expect(screen.getByText(contextBudgetScenarios[0].scenarioData.task)).toBeTruthy()
    fireEvent.click(screen.getByText('Context auswerten'))
    expect(screen.getByText('Context-Pack Qualität')).toBeTruthy()
  })

  it('Failure Mode Tree renders its symptom without throwing', () => {
    render(
      <FailureModeTree scenario={failureModeScenarios[0]} onComplete={vi.fn()} />,
    )
    expect(screen.getByText(failureModeScenarios[0].scenarioData.symptom)).toBeTruthy()
  })

  it('Retrieval Factory renders its profile and evaluates without throwing', () => {
    const sc = retrievalFactoryScenarios[0]
    render(<RetrievalFactory scenario={sc} onComplete={vi.fn()} />)
    expect(screen.getByText(sc.scenarioData.corpusProfile)).toBeTruthy()
    fireEvent.click(screen.getByText(/Semantic/))
    fireEvent.click(screen.getByText('Kein Reranking'))
    fireEvent.click(screen.getByText('Kein zusätzlicher Chunk-Context'))
    fireEvent.click(screen.getByText('Pipeline auswerten'))
    expect(screen.getByText('Pipeline-Fit')).toBeTruthy()
  })

  it('Eval Designer renders its system and evaluates without throwing', () => {
    const sc = evalDesignerScenarios[0]
    render(<EvalDesigner scenario={sc} onComplete={vi.fn()} />)
    expect(screen.getByText(sc.scenarioData.system)).toBeTruthy()
    fireEvent.click(screen.getByText(/Task-Erfolg/))
    fireEvent.click(screen.getByText(/Regression-Set bekannter/))
    fireEvent.click(screen.getByText('Kein Grounding-Eval'))
    fireEvent.click(screen.getByText('Eval auswerten'))
    expect(screen.getByText('Eval-Fit')).toBeTruthy()
  })

  it('Security Incident Room renders its incident and evaluates without throwing', () => {
    const sc = securityIncidentScenarios[0]
    render(<SecurityIncidentRoom scenario={sc} onComplete={vi.fn()} />)
    expect(screen.getByText(sc.scenarioData.incident)).toBeTruthy()
    fireEvent.click(screen.getByText(/Over-broad Tool-Permission/))
    fireEvent.click(screen.getByText(/Backup wiederherstellen/))
    fireEvent.click(screen.getByText(/Least Privilege/))
    fireEvent.click(screen.getByText('Response auswerten'))
    expect(screen.getByText('Response-Fit')).toBeTruthy()
  })

  it('Repo Refactor renders its repo and evaluates without throwing', () => {
    const sc = repoRefactorScenarios[0]
    render(<RepoRefactor scenario={sc} onComplete={vi.fn()} />)
    expect(screen.getByText(sc.scenarioData.repo)).toBeTruthy()
    fireEvent.click(screen.getByText(/Decision-Log/))
    fireEvent.click(screen.getByText(/kleine Module splitten/))
    fireEvent.click(screen.getByText(/vorhersehbare Orte/))
    fireEvent.click(screen.getByText('Refactor auswerten'))
    expect(screen.getByText('Refactor-Fit')).toBeTruthy()
  })

  it('Paper Figure Decoder renders its figure and evaluates without throwing', () => {
    const sc = paperFigureScenarios[0]
    render(<PaperFigureDecoder scenario={sc} onComplete={vi.fn()} />)
    expect(screen.getByText(sc.scenarioData.caption)).toBeTruthy()
    fireEvent.click(screen.getByText(/visuell-reichen Docs schlägt/))
    fireEvent.click(screen.getByText(/layout-\/tabellen/))
    fireEvent.click(screen.getByText('Figure auswerten'))
    expect(screen.getByText('Decode-Fit')).toBeTruthy()
  })

  it('Capstone Simulator renders its system and evaluates the integrated design', () => {
    const sc = capstoneScenarios[0]
    render(<CapstoneSimulator scenario={sc} onComplete={vi.fn()} />)
    expect(screen.getByText(sc.scenarioData.system)).toBeTruthy()
    fireEvent.click(screen.getByText(/Control Plane: stabile Regeln/))
    fireEvent.click(screen.getByText(/Typed Tool-Contracts/))
    fireEvent.click(screen.getByText(/Hybrid \(lexical/))
    fireEvent.click(screen.getByText(/Task-Erfolg \+ Regression-Set \+ Grounding/))
    fireEvent.click(screen.getByText(/Approval-Gates \+ Input-Isolation/))
    fireEvent.click(screen.getByText(/Lesbare Struktur \+ kleine Units \+ Source-Material/))
    fireEvent.click(screen.getByText('Architektur auswerten'))
    expect(screen.getByText('System-Fit')).toBeTruthy()
  })

  it('Layer Stack Builder renders and evaluates', () => {
    const sc = layerStackScenarios[0]
    render(<LayerStackBuilder scenario={sc} onComplete={vi.fn()} />)
    expect(screen.getByText(sc.scenarioData.feature)).toBeTruthy()
    fireEvent.click(screen.getByText('Retrieval'))
    fireEvent.click(screen.getByText('Tools'))
    fireEvent.click(screen.getByText('Memory'))
    fireEvent.click(screen.getByText('Zuordnung auswerten'))
    expect(screen.getByText('Layer-Treffer')).toBeTruthy()
  })

  it('Trade-off Duel renders and evaluates', () => {
    const sc = tradeOffScenarios[0]
    render(<TradeOffDuel scenario={sc} onComplete={vi.fn()} />)
    expect(screen.getByText(sc.scenarioData.scenario)).toBeTruthy()
    fireEvent.click(screen.getByText(/Workflow \/ Router/))
    fireEvent.click(screen.getByText(/Kleines, schnelles Modell/))
    fireEvent.click(screen.getByText('Entscheidung auswerten'))
    expect(screen.getByText('Trade-off-Fit')).toBeTruthy()
  })

  it('Constraint Puzzle renders and evaluates', () => {
    const sc = constraintScenarios[0]
    render(<ConstraintPuzzle scenario={sc} onComplete={vi.fn()} />)
    expect(screen.getByText(sc.scenarioData.requirement)).toBeTruthy()
    fireEvent.click(screen.getByText(/Structured Output per Schema/))
    fireEvent.click(screen.getByText(/Validieren und bei Verstoß/))
    fireEvent.click(screen.getByText('Lösung auswerten'))
    expect(screen.getByText('Constraint-Fit')).toBeTruthy()
  })

  it('Allocator renders sliders and evaluates with a graded fit', () => {
    const sc = contextAllocatorScenarios[0]
    render(<AllocatorBoard scenario={sc} onComplete={vi.fn()} />)
    expect(screen.getByText(sc.scenarioData.situation)).toBeTruthy()
    fireEvent.click(screen.getByText('Allokation auswerten'))
    expect(screen.getByText('Allokations-Fit')).toBeTruthy()
  })

  it('Trust Boundary renders its zones and elements', () => {
    const sc = trustBoundaryScenarios[0]
    render(<TrustBoundaryBoard scenario={sc} onComplete={vi.fn()} />)
    expect(screen.getByText(sc.scenarioData.system)).toBeTruthy()
    expect(screen.getAllByText('Approval').length).toBeGreaterThan(0)
    expect(screen.getByText('Jedes Element einer Zone zuweisen')).toBeTruthy()
  })

  it('Incident Triage renders and evaluates the order', () => {
    const sc = incidentTriageScenarios[0]
    render(<IncidentTriageBoard scenario={sc} onComplete={vi.fn()} />)
    expect(screen.getByText(sc.scenarioData.incident)).toBeTruthy()
    fireEvent.click(screen.getByText('Reihenfolge auswerten'))
    expect(screen.getByText('Triage-Fit')).toBeTruthy()
  })

  it('Pipeline Builder adds a stage and evaluates', () => {
    const sc = pipelineScenarios[0]
    render(<PipelineBuilderBoard scenario={sc} onComplete={vi.fn()} />)
    expect(screen.getByText(sc.scenarioData.goal)).toBeTruthy()
    fireEvent.click(screen.getByText('+ Ingest'))
    fireEvent.click(screen.getByText('Pipeline auswerten'))
    expect(screen.getByText('Pipeline-Fit')).toBeTruthy()
  })

  it('System Postmortem renders and evaluates', () => {
    const sc = systemPostmortemScenarios[0]
    render(<SystemPostmortem scenario={sc} onComplete={vi.fn()} />)
    expect(screen.getByText(sc.scenarioData.incident)).toBeTruthy()
    fireEvent.click(screen.getByText(/Veraltetes Dokument im Retrieval/))
    fireEvent.click(screen.getByText(/Doc-Version pinnen/))
    fireEvent.click(screen.getByText('Postmortem auswerten'))
    expect(screen.getByText('Postmortem-Fit')).toBeTruthy()
  })

  it('Agent Trace Debugger / Tool Contract Forge / Architecture Builder render', () => {
    const trace = render(
      <AgentTraceDebugger scenario={agentTraceScenarios[0]} onComplete={vi.fn()} />,
    )
    expect(screen.getByText(agentTraceScenarios[0].scenarioData.task)).toBeTruthy()
    trace.unmount()

    const tool = render(
      <ToolContractForge scenario={toolContractScenarios[0]} onComplete={vi.fn()} />,
    )
    expect(screen.getAllByText(/Tool-Contract/).length).toBeGreaterThan(0)
    tool.unmount()

    render(<ArchitectureBuilder scenario={architectureScenarios[0]} onComplete={vi.fn()} />)
    expect(screen.getByText(architectureScenarios[0].scenarioData.task)).toBeTruthy()
  })
})

function renderLabRoute(path: string) {
  return render(
    <ProgressProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/lab/:id" element={<LabPage />} />
          <Route path="/roadmap" element={<div>ROADMAP</div>} />
        </Routes>
      </MemoryRouter>
    </ProgressProvider>,
  )
}

describe('LabPage host + gating', () => {
  it('renders a reachable lab (no prerequisites)', async () => {
    renderLabRoute('/lab/LAB-FAILURE-MODE-TREE')
    expect(await screen.findByText('Failure Mode Tree')).toBeTruthy()
  })

  it('a prereq-locked lab is playable in dev (UNLOCK_ALL)', async () => {
    // Gating correctness is covered by roadmapStatus.test; here dev-unlock lets the
    // lab render despite the unmet NODE-01-03 prerequisite.
    renderLabRoute('/lab/LAB-CONTEXT-BUDGET-BOARD')
    expect(await screen.findByText('Context Budget Board')).toBeTruthy()
  })

  it('shows not-found for an unknown lab id', async () => {
    renderLabRoute('/lab/LAB-NOPE')
    expect(await screen.findByText('Lab nicht gefunden')).toBeTruthy()
  })
})
