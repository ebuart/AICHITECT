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
    payload: ['quelle: eingeloggter mitarbeiter (intern)', 'klassifiziert: DATEN · anweisungen erkannt: 0'],
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
            'übernommen: pricing/rabatte.md §3 (28.06.) · sales/faq.md (12.03.)',
            'verworfen: 12 treffer (score < 0.42)',
          ]
        : [
            'suche: "staffelrabatt bestandskunden"',
            'übernommen: 14/14 treffer · verworfen: 0',
            'u.a. sales/faq.md (12.03.) · protokoll-q1.md · newsletter-2025.md',
          ],
      note: curationOn
        ? 'Zwei von 14 Treffern behalten, beide aus der Akte bekannt. Einer davon ist der aktuelle.'
        : 'Nichts aussortiert. Der aktuelle Beleg ist einer von 14.',
      status: curationOn ? 'ok' : 'warn',
    })
  } else {
    steps.push({
      station: 'retrieval',
      title: 'Retrieval',
      payload: ['— abgeschaltet —'],
      note: 'Keine Suche. Alles, was danach kommt, speist sich aus dem Trainingsstand des Modells.',
      status: 'off',
    })
  }

  if (retrievalOn) {
    steps.push({
      station: 'context',
      title: 'Context',
      payload: curationOn
        ? [
            'assembly: system-prompt (380 tok) · rabatte.md §3 (210 tok) · faq.md auszug (120 tok)',
            'frage (24 tok) · output-reserve (1 000 tok)',
            'fenster: 1 734 / 8 192 tok',
          ]
        : [
            'assembly: system-prompt (380 tok) · 14 dokumente (5 900 tok)',
            'position 1: sales/faq.md … position 9: pricing/rabatte.md §3 …',
            'frage (24 tok) · output-reserve (1 000 tok)',
            'fenster: 7 304 / 8 192 tok',
          ],
      note: curationOn
        ? 'Kompakte Assembly: zwei Belege direkt neben der Frage.'
        : 'Voll, aber nicht übergelaufen. Der Absatz aus rabatte.md steht auf Position 9 von 14.',
      status: curationOn ? 'ok' : 'warn',
    })
  } else {
    steps.push({
      station: 'context',
      title: 'Context',
      payload: ['assembly: system-prompt (380 tok) · belege: 0', 'frage (24 tok) · output-reserve (1 000 tok)', 'fenster: 404 / 8 192 tok'],
      note: 'Nur Regeln und Frage im Fenster. Zur Sache selbst sieht das Modell nichts.',
      status: 'warn',
    })
  }

  // What the model drafts depends on what it saw.
  const modelDraft = !retrievalOn
    ? '"Der Staffelrabatt beträgt 5 % ab 100 Stück."'
    : !curationOn
      ? '"Laut FAQ gilt: 5 % ab 100 Stück." [Quelle: sales/faq.md]'
      : '"Seit dem 1. Juli gilt: 8 % ab 50 Stück." [Quelle: pricing/rabatte.md §3]'
  steps.push({
    station: 'model',
    title: 'Modell',
    payload: [
      `entwurf: ${modelDraft}`,
      'tool-vorschlag: update_crm(segment="bestand", rabattstufe="neu")',
    ],
    note:
      !retrievalOn || !curationOn
        ? 'Flüssig und überzeugt formuliert. Ob die Zahl stimmt, steht in der Akte, nicht im Ton.'
        : 'Die Zahl im Entwurf stammt aus dem mitgelieferten Beleg. Dazu ein ungefragter Tool-Vorschlag.',
    status: !retrievalOn || !curationOn ? 'warn' : 'ok',
  })

  steps.push(
    gateOn
      ? {
          station: 'toolgate',
          title: 'Tool-Gate',
          payload: ['update_crm(segment="bestand", rabattstufe="neu")', 'scope: write:crm/* · betrifft: 214 datensätze', 'status: HOLD · wartet auf freigabe'],
          note: 'Der Schreibzugriff ist angehalten. Ohne Freigabe passiert im CRM nichts.',
          status: 'ok',
        }
      : {
          station: 'toolgate',
          title: 'Tool-Gate',
          payload: ['— abgeschaltet —', 'update_crm(segment="bestand", rabattstufe="neu")', 'status: EXECUTED · 214 datensätze geändert'],
          note: 'Kein Gate, keine Rückfrage. Der Schreibzugriff ist durchgelaufen.',
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
        payload: ['grounding: "5 % ab 100 Stück" ↔ belege im context: 0', 'ergebnis: UNGESTÜTZT · aktion: antwort zurückhalten'],
        note: 'Für die Zahl existiert kein Beleg im Fenster. Der Check hält die Antwort zurück.',
        status: 'fail',
      })
    } else if (!curationOn) {
      steps.push({
        station: 'check',
        title: 'Check',
        payload: ['grounding: "5 % ab 100 Stück" ↔ sales/faq.md: TREFFER', 'ergebnis: GEDECKT · aktion: durchlassen'],
        note: 'Der Check prüft nur gegen die mitgelieferten Belege. sales/faq.md ist einer davon.',
        status: 'warn',
      })
    } else {
      steps.push({
        station: 'check',
        title: 'Check',
        payload: ['grounding: "8 % ab 50 Stück" ↔ pricing/rabatte.md §3: TREFFER', 'ergebnis: GEDECKT · aktion: durchlassen'],
        note: 'Jede Aussage der Antwort hat einen Beleg im Fenster.',
        status: 'ok',
      })
    }
  } else {
    steps.push({
      station: 'check',
      title: 'Check',
      payload: ['— abgeschaltet —'],
      note: 'Keine Prüfung. Der Entwurf des Modells geht unverändert raus.',
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
  /** Attention primer shown BEFORE and DURING the run (direction, not spoiler). */
  watch: string
  /** Diagnostic question after the run — answered by reporting a station. */
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
    watch: 'Beim Durchlauf beobachten: Welche Stationen verändern die Anfrage, und wo wird etwas angehalten?',
    prompt: 'Sauberer Lauf. Eine Station hat trotzdem eingegriffen und eine riskante Aktion angehalten. Welche?',
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
    watch: 'Worauf achten: Was liegt diesmal im Context-Fenster, und woher stammt die Zahl im Modell-Entwurf?',
    prompt: 'Der Nutzer bekommt keine Antwort. Welche Station hat die Notbremse gezogen?',
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
    watch: 'Worauf achten: Wie viele Dokumente erreichen das Fenster, und welches davon zitiert der Entwurf am Ende?',
    prompt: 'Falsche Zahl, mit echter Quellenangabe. An welcher Station ist der Schaden entstanden?',
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
    watch: 'Worauf achten: Der Modell-Entwurf enthält mehr als nur eine Antwort. Was passiert diesmal mit dem zweiten Teil?',
    prompt: 'Die Antwort stimmt. Trotzdem ist heute ein Vorfall passiert. An welcher Station?',
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
    watch: 'Zum Vergleich mit Lauf 2: gleiche Wissenslücke, eine Schutzebene weniger. Was ändert sich am Ende?',
    prompt: 'Die erfundene Zahl erreicht den Nutzer. Welche Station hätte sie als letzte noch stoppen können?',
    target: 'check',
    solvedNote: 'Der Check, wie in Lauf 2. Der Unterschied zwischen „keine Antwort" und „falsche Antwort beim Kunden" war genau eine Ebene. Das ist Defense in Depth.',
    finding: 'Erfundene Zahl erreicht den Nutzer.',
    verdict: 'bad',
  },
]
