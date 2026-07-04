import type { Feedback } from '@/types'

// Feedback for the Layer Stack Builder (analyzes the classification, not the learner).
export const lsbFeedback = {
  layerMismatch: {
    id: 'FB-LSB-WRONG-LAYER',
    severity: 'risk',
    decision: 'Mindestens ein Fehler ist der falschen System-Ebene zugeordnet.',
    consequence: 'Die Reparatur setzt auf der falschen Ebene an; der Fehler bleibt oder kehrt zurück.',
    realWorldContext: 'Unter jedem AI-Feature liegen Ebenen (App, Context, Tools, Retrieval, Memory, Evals, Security). Das sichtbare Symptom ist selten die Ursachen-Ebene.',
    failureMode: 'Falsche Ebene → generischer Fix (mehr Modell, mehr Prompt) ohne Wirkung.',
    architectureRule: 'Ordne jeden Fehler der Ebene zu, auf der er entsteht — nicht der, auf der er auffällt.',
    improvedSolution: 'Folge dem Trace zur ursächlichen Ebene und repariere dort.',
    reviewHook: 'layer_classification_transfer',
  },
  clean: {
    id: 'FB-LSB-CLEAN',
    severity: 'strong',
    decision: 'Jeder Fehler ist seiner Ursachen-Ebene korrekt zugeordnet.',
    consequence: 'Die Reparatur kann gezielt auf der richtigen Ebene ansetzen.',
    realWorldContext: 'Das Layer-Modell macht Debugging in AI-Systemen systematisch statt ratend.',
    failureMode: 'Vermieden: oberflächliche Fixes an der Symptom-Ebene.',
    architectureRule: 'Erst Ebene bestimmen, dann reparieren.',
    improvedSolution: 'Als Nächstes die Reparatur auf der identifizierten Ebene wählen.',
    reviewHook: 'layer_classification_transfer',
  },
} satisfies Record<string, Feedback>
