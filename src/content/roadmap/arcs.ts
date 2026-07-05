import type { RoadmapArc } from '@/types'

// Roadmap arcs (domain/11_curriculum_graph.md ROADMAP_ARCS). German goals;
// English technical titles preserved (PC-035).
export const arcs: RoadmapArc[] = [
  { id: 'ARC-00', order: 0, title: 'Orientation', goal: 'Produktrahmen und System-Denkweise etablieren.' },
  { id: 'ARC-01', order: 1, title: 'Foundations', goal: 'AI-native System-Layers und das Augmented-LLM-Modell verstehen.' },
  { id: 'ARC-02', order: 2, title: 'Context Engineering', goal: 'Token-/Context-Entscheidungen, Noise, Compression und Isolation.' },
  { id: 'ARC-03', order: 3, title: 'Tool Boundaries', goal: 'Tools als Contracts, Structured Outputs, Formate und Permissions.' },
  { id: 'ARC-04', order: 4, title: 'Control Flow & Agents', goal: 'Workflows vs Agents und gängige agentische Muster.' },
  { id: 'ARC-05', order: 5, title: 'Retrieval Systems', goal: 'RAG, Hybrid Retrieval, Reranking, Contextual und Visual Retrieval.' },
  { id: 'ARC-06', order: 6, title: 'Memory & Long-Running Work', goal: 'Durable Project Memory und Kontinuität über Sessions.' },
  { id: 'ARC-07', order: 7, title: 'Evals & Observability', goal: 'AI-Systeme messen und debuggen.' },
  { id: 'ARC-08', order: 8, title: 'Security & Governance', goal: 'Sicherheitsgrenzen, Prompt Injection, Least Privilege, Approvals.' },
  { id: 'ARC-09', order: 9, title: 'Repo Architecture & Team Scale', goal: 'AI-freundliche Codebase-Architektur über Sessions und Teams.' },
  { id: 'ARC-10', order: 10, title: 'Capstone', goal: 'Alle Layers zu einem AI-native Software-Team-System integrieren.' },
  { id: 'ARC-11', order: 11, title: "The Director's Seat", goal: 'Vom Bauen zum Dirigieren: Agenten-Schwärme ausrichten — Context, Struktur, Aufsicht (DIRECTION track).' },
  { id: 'ARC-12', order: 12, title: 'Targeting the Swarm', goal: 'Den Schwarm ausrichten: der Brief als Engpass, Abhängigkeiten sequenzieren, Drift triagieren (DIRECTION track, research-backed).' },
  { id: 'ARC-13', order: 13, title: 'Delivery & Acceptance', goal: 'Die PM-Hälfte: Kapazität nach Wert/Risiko priorisieren und streichen, Agent-Output gegen den Brief abnehmen (DIRECTION track).' },
  { id: 'ARC-14', order: 14, title: 'System Physics', goal: 'Die zeitlose Mechanik unter jedem System: Warteschlangen, Backpressure, Kapazität (ARCHITECTURE-PHYSICS track, OQ-0017).' },
]
