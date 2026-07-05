// RequestFlowExplorer — pure trace model (IX-7). One request travels the pipeline; the
// learner switches layers off and reads, per station, what the payload looks like and what
// broke. All snapshots are precomputed here so the UI only animates through states.

export type StationId =
  | 'user'
  | 'boundary'
  | 'retrieval'
  | 'context'
  | 'model'
  | 'toolgate'
  | 'check'

export type StationStatus = 'ok' | 'warn' | 'fail' | 'off'

export interface StationSnapshot {
  station: StationId
  title: string
  /** The artifact at this hop — short, log-like lines the learner opens and reads (IX-5). */
  payload: string[]
  /** One plain sentence: what this station did in THIS run. */
  note: string
  status: StationStatus
}

export interface FlowToggle {
  id: string
  /** Switch label, e.g. "Retrieval". */
  label: string
  /** What turning it OFF means, shown as tooltip/subline. */
  off: string
}

export interface TraceResult {
  steps: StationSnapshot[]
  answer: {
    text: string
    verdict: 'good' | 'bad' | 'blocked'
    explain: string
  }
}

export const STATION_LABEL: Record<StationId, string> = {
  user: 'Anfrage',
  boundary: 'Grenze',
  retrieval: 'Retrieval',
  context: 'Context',
  model: 'Modell',
  toolgate: 'Tool-Gate',
  check: 'Check',
}

export const FLOW_TOGGLES: FlowToggle[] = [
  { id: 'retrieval', label: 'Retrieval', off: 'Keine Belege — das Modell kennt nur seinen Trainingsstand.' },
  { id: 'curation', label: 'Context-Kuration', off: 'Alle 14 Treffer landen ungefiltert im Fenster.' },
  { id: 'toolgate', label: 'Tool-Gate', off: 'Tool-Aufrufe laufen ohne Freigabe durch.' },
  { id: 'check', label: 'Grounding-Check', off: 'Antworten gehen ungeprüft raus.' },
]

const QUESTION = 'Ab wann gilt der neue Staffelrabatt für Bestandskunden?'

/**
 * The one scenario of NODE-01-03: a policy question whose answer CHANGED recently
 * (training data still has the old numbers). Every layer removed produces a different,
 * characteristic failure — that mapping is the lesson.
 */
export function traceRequest(active: Set<string>): TraceResult {
  const retrievalOn = active.has('retrieval')
  const curationOn = active.has('curation')
  const gateOn = active.has('toolgate')
  const checkOn = active.has('check')

  const steps: StationSnapshot[] = []

  steps.push({
    station: 'user',
    title: 'Anfrage',
    payload: ['POST /assist', `"${QUESTION}"`],
    note: 'Ein Mitarbeiter fragt im internen Assistenten nach.',
    status: 'ok',
  })

  steps.push({
    station: 'boundary',
    title: 'Grenze',
    payload: ['quelle: eingeloggter mitarbeiter (intern)', 'input als DATEN markiert — enthält keine anweisungen'],
    note: 'Eingang geprüft. Ab hier ist die Frage Nutzlast, kein Befehl.',
    status: 'ok',
  })

  if (retrievalOn) {
    steps.push({
      station: 'retrieval',
      title: 'Retrieval',
      payload: curationOn
        ? [
            'suche: "staffelrabatt bestandskunden"',
            '#1  pricing/rabatte.md §3 · geändert 28.06. ✓',
            '#2  sales/faq.md (Stand März) — alt, mit drin',
            '12 weitere Treffer verworfen (Newsletter, Protokolle …)',
          ]
        : [
            'suche: "staffelrabatt bestandskunden"',
            '14 Treffer — ALLE übernommen, nichts verworfen',
            'darunter: faq.md (März), 3 Meeting-Protokolle, newsletter-2025.md',
          ],
      note: curationOn
        ? '2 von 14 Treffern behalten. Der aktuelle Beleg ist dabei.'
        : 'Nichts aussortiert. Der aktuelle Beleg ist irgendwo da drin.',
      status: curationOn ? 'ok' : 'warn',
    })
  } else {
    steps.push({
      station: 'retrieval',
      title: 'Retrieval',
      payload: ['— abgeschaltet —'],
      note: 'Keine Suche. Was das Modell gleich sagt, kommt aus dem Training.',
      status: 'off',
    })
  }

  if (retrievalOn) {
    steps.push({
      station: 'context',
      title: 'Context',
      payload: curationOn
        ? [
            'system-prompt · 380 tok',
            'rabatte.md §3: "ab 01.07.: 8 % ab 50 Stück" · 210 tok',
            'faq.md auszug · 120 tok',
            'frage · 24 tok   ·   output-reserve · 1 000 tok',
            'fenster: 1 734 / 8 192 tok',
          ]
        : [
            'system-prompt · 380 tok',
            '14 dokumente · 5 900 tok (rabatte.md §3 steht auf position 9)',
            'frage · 24 tok   ·   output-reserve · 1 000 tok',
            'fenster: 7 304 / 8 192 tok — fast voll',
          ],
      note: curationOn
        ? 'Kompakt. Der entscheidende Absatz steht praktisch neben der Frage.'
        : 'Das Fenster ist voll mit Altem. Der eine richtige Absatz konkurriert mit 13 anderen.',
      status: curationOn ? 'ok' : 'warn',
    })
  } else {
    steps.push({
      station: 'context',
      title: 'Context',
      payload: ['system-prompt · 380 tok', 'frage · 24 tok', 'KEINE belege', 'output-reserve · 1 000 tok'],
      note: 'Nur Regeln und Frage. Zur Sache selbst sieht das Modell: nichts.',
      status: 'warn',
    })
  }

  // What the model drafts depends on what it saw.
  const modelDraft = !retrievalOn
    ? '"Der Staffelrabatt beträgt 5 % ab 100 Stück." (Trainingsstand — klingt sicher, ist der alte Wert)'
    : !curationOn
      ? '"Laut FAQ: 5 % ab 100 Stück." (zitiert das alte faq.md — der neue Absatz ging im Rauschen unter)'
      : '"Seit dem 1. Juli gilt: 8 % ab 50 Stück." [Quelle: rabatte.md §3]'
  steps.push({
    station: 'model',
    title: 'Modell',
    payload: [
      `entwurf: ${modelDraft}`,
      'tool-vorschlag: update_crm(rabattstufe="neu") — „soll ich das gleich hinterlegen?"',
    ],
    note:
      !retrievalOn || !curationOn
        ? 'Das Modell schreibt flüssig und überzeugt. Am Ton ist der Fehler nicht zu erkennen.'
        : 'Entwurf steht, Zahl stammt aus dem Beleg. Zusätzlich schlägt das Modell einen CRM-Eintrag vor.',
    status: !retrievalOn || !curationOn ? 'warn' : 'ok',
  })

  steps.push(
    gateOn
      ? {
          station: 'toolgate',
          title: 'Tool-Gate',
          payload: ['update_crm(…) → ANGEHALTEN', 'schreibender zugriff auf 214 kundendatensätze', 'wartet auf menschliche freigabe'],
          note: 'Der Vorschlag bleibt ein Vorschlag. Schreiben ins CRM braucht eine Freigabe.',
          status: 'ok',
        }
      : {
          station: 'toolgate',
          title: 'Tool-Gate',
          payload: ['— abgeschaltet —', 'update_crm(…) AUSGEFÜHRT', '214 kundendatensätze geändert'],
          note: 'Niemand hat gefragt. Der Rabatt steht jetzt in 214 Datensätzen.',
          status: 'fail',
        },
  )

  // The check compares the draft against the SUPPLIED docs — which is exactly its blind spot
  // when the supplied docs are the wrong ones (curation off): grounded ≠ correct.
  const draftIsWrong = !retrievalOn || !curationOn
  if (checkOn) {
    if (!retrievalOn) {
      steps.push({
        station: 'check',
        title: 'Check',
        payload: ['grounding: aussage "5 % ab 100 Stück" ↔ belege: KEINE', 'ergebnis: ungestützt → antwort zurückhalten'],
        note: 'Keine Quelle für die Zahl. Der Check zieht die Notbremse.',
        status: 'fail',
      })
    } else if (!curationOn) {
      steps.push({
        station: 'check',
        title: 'Check',
        payload: ['grounding: aussage ↔ faq.md (liegt im context) ✓', 'ergebnis: gedeckt — durchgelassen'],
        note: 'Der Check prüft gegen die MITGELIEFERTEN Belege. Das alte FAQ ist einer. Gedeckt heißt nicht richtig.',
        status: 'warn',
      })
    } else {
      steps.push({
        station: 'check',
        title: 'Check',
        payload: ['grounding: "8 % ab 50 Stück" ↔ rabatte.md §3 ✓', 'zahlen exakt übernommen ✓'],
        note: 'Jede Aussage hat ihren Beleg. Kann raus.',
        status: 'ok',
      })
    }
  } else {
    steps.push({
      station: 'check',
      title: 'Check',
      payload: ['— abgeschaltet —'],
      note: 'Was immer das Modell geschrieben hat, geht jetzt genau so raus.',
      status: 'off',
    })
  }

  // Final answer.
  let answer: TraceResult['answer']
  if (!retrievalOn && checkOn) {
    answer = {
      text: '„Dazu habe ich keine belegte Antwort. Ich habe das Pricing-Team verlinkt."',
      verdict: 'blocked',
      explain:
        'Retrieval fehlt, aber der Check hat die erfundene Zahl abgefangen. Unbefriedigend für den Nutzer, kein Schaden fürs System. So sieht ein Sicherheitsnetz aus, das arbeitet.',
    }
  } else if (draftIsWrong) {
    answer = {
      text: !retrievalOn
        ? '„Der Staffelrabatt beträgt 5 % ab 100 Stück."'
        : '„Laut FAQ gilt: 5 % ab 100 Stück."',
      verdict: 'bad',
      explain: !retrievalOn
        ? 'Falsch, und niemand hat es gemerkt: Der Sales schickt heute Angebote mit den alten Konditionen raus. Der Fehler saß nicht im Modell, sondern in der fehlenden Versorgung.'
        : 'Falsch mit Quellenangabe — die überzeugendste Sorte falsch. Der richtige Absatz WAR im Fenster, Position 9 von 14. Aufmerksamkeit ist knapper als Platz.',
    }
  } else if (!gateOn) {
    answer = {
      text: '„Seit dem 1. Juli gilt: 8 % ab 50 Stück." [Quelle: rabatte.md §3] — CRM aktualisiert.',
      verdict: 'bad',
      explain:
        'Die Antwort stimmt. Trotzdem ist heute ein Vorfall: 214 CRM-Einträge wurden ungefragt geändert. Eine richtige Antwort und ein Schaden schließen sich nicht aus.',
    }
  } else {
    answer = {
      text: '„Seit dem 1. Juli gilt: 8 % ab 50 Stück." [Quelle: rabatte.md §3]',
      verdict: 'good',
      explain:
        'Aktuelle Zahl, echte Quelle, kein ungefragter Schreibzugriff. Jede Ebene hat ihren Teil beigetragen — und jede wäre einzeln ein anderer Vorfall gewesen.',
    }
  }

  return { steps, answer }
}

export const ALL_ON: ReadonlySet<string> = new Set(FLOW_TOGGLES.map((t) => t.id))

// ── Guided protocol (user feedback 2026-07-05: a free sandbox gets skimmed; the runs are
// the lesson, so they are REQUIRED). Five prescribed runs; after each, the learner must tap
// the station that answers the diagnostic question before the next run unlocks. Every solved
// run adds a row to the findings board — at the end the layer→incident map is visible.
export interface Experiment {
  id: string
  /** Card title, e.g. "Lauf 2 · ohne Retrieval". */
  title: string
  /** Which layer(s) this run removes — shown in the findings board. */
  missing: string
  /** Toggle ids that stay ON for this run. */
  active: string[]
  /** Diagnostic question after the run — answered by tapping a station. */
  prompt: string
  /** The station that answers the prompt. */
  target: StationId
  /** Shown after the correct tap. */
  solvedNote: string
  /** Findings-board row: what this run produced. */
  finding: string
  verdict: 'good' | 'bad' | 'blocked'
}

const ids = FLOW_TOGGLES.map((t) => t.id)
const except = (...off: string[]) => ids.filter((id) => !off.includes(id))

export const EXPERIMENTS: Experiment[] = [
  {
    id: 'baseline',
    title: 'Lauf 1 · alle Ebenen an',
    missing: '—',
    active: [...ids],
    prompt: 'Sauberer Lauf. Eine Station hat trotzdem eingegriffen und eine riskante Aktion angehalten. Welche? Antippen.',
    target: 'toolgate',
    solvedNote: 'Das Tool-Gate. Der CRM-Schreibzugriff bleibt ein Vorschlag, bis ein Mensch freigibt. In den nächsten Läufen fällt je eine Ebene weg.',
    finding: 'Belegte Antwort. Riskante Aktion angehalten.',
    verdict: 'good',
  },
  {
    id: 'no-retrieval',
    title: 'Lauf 2 · ohne Retrieval',
    missing: 'Retrieval',
    active: except('retrieval'),
    prompt: 'Der Nutzer bekommt keine Antwort. Welche Station hat die Notbremse gezogen? Antippen.',
    target: 'check',
    solvedNote: 'Der Check. Ohne Belege war die Zahl des Modells ungestützt, also hält er sie zurück. Unbefriedigend, aber kein Schaden.',
    finding: 'Keine Antwort. Check zieht die Notbremse.',
    verdict: 'blocked',
  },
  {
    id: 'no-curation',
    title: 'Lauf 3 · ohne Context-Kuration',
    missing: 'Kuration',
    active: except('curation'),
    prompt: 'Falsche Zahl, mit echter Quellenangabe. An welcher Station ist der Schaden entstanden? Antippen.',
    target: 'context',
    solvedNote: 'Im Context. 14 Dokumente im Fenster, der richtige Absatz auf Position 9, das alte FAQ gewinnt. Der Check lässt es durch, denn „gedeckt" heißt nicht „richtig".',
    finding: 'Falsche Zahl, mit Quellenangabe.',
    verdict: 'bad',
  },
  {
    id: 'no-gate',
    title: 'Lauf 4 · ohne Tool-Gate',
    missing: 'Tool-Gate',
    active: except('toolgate'),
    prompt: 'Die Antwort stimmt. Trotzdem ist heute ein Vorfall passiert. An welcher Station? Antippen.',
    target: 'toolgate',
    solvedNote: 'Am fehlenden Gate: update_crm lief ungefragt durch, 214 Datensätze geändert. Eine richtige Antwort und ein Schaden schließen sich nicht aus.',
    finding: '214 CRM-Einträge ungefragt geändert.',
    verdict: 'bad',
  },
  {
    id: 'no-net',
    title: 'Lauf 5 · ohne Retrieval und ohne Check',
    missing: 'Retrieval + Check',
    active: except('retrieval', 'check'),
    prompt: 'Die erfundene Zahl erreicht den Nutzer. Welche Station hätte sie als letzte noch stoppen können? Antippen.',
    target: 'check',
    solvedNote: 'Der Check, wie in Lauf 2. Der Unterschied zwischen „keine Antwort" und „falsche Antwort beim Kunden" war genau eine Ebene. Das ist Defense in Depth.',
    finding: 'Erfundene Zahl erreicht den Nutzer.',
    verdict: 'bad',
  },
]
