// LoadSim — pure queueing simulation (IX-7). The whole run is precomputed as one frame per
// sim-second; the component only plays frames. Deterministic: arrivals follow a fixed
// repeating pattern (bursts included), service time is fixed, FIFO queue. This is the
// supermarket checkout, wearing production clothes: 2 workers ≙ 2 open registers.

export interface SimConfig {
  /** External arrivals per second, repeating pattern (deterministic bursts). */
  pattern: number[]
  /** Sim length in seconds. */
  seconds: number
  /** Parallel worker slots (the LLM gateway's concurrency). */
  slots: number
  /** Max queue length; null = unbounded. Overflow is rejected with 429. */
  queueCap: number | null
  /** Client timeout while WAITING (seconds); null = clients wait forever. */
  timeoutSec: number | null
  /** Timed-out requests re-enter the queue once (the naive retry). */
  retryOnTimeout: boolean
}

export interface Frame {
  t: number
  /** External arrivals this second. */
  newExternal: number
  /** Entered the queue this second (external accepted + retries). */
  entered: number
  queued: number
  inFlight: number
  donePerSec: number
  doneTotal: number
  timeoutsTotal: number
  rejectedTotal: number
  /** Rolling (15 s) average wait of requests that reached a worker. */
  avgWait: number
  /** Rolling (15 s) averages for the live Little's-Law strip: L ≈ λ · W. */
  lambda: number
  littleL: number
}

export function runSim(cfg: SimConfig): Frame[] {
  const frames: Frame[] = []
  let queue: { enter: number; retried: boolean }[] = []
  let busy: number[] = [] // finish times
  let doneTotal = 0
  let timeoutsTotal = 0
  let rejectedTotal = 0
  const waitWindow: { t: number; w: number }[] = []
  const enterWindow: { t: number; n: number }[] = []
  const queueWindow: { t: number; q: number }[] = []
  const WINDOW = 15

  for (let t = 0; t < cfg.seconds; t++) {
    // 1) workers finish
    const finished = busy.filter((f) => f <= t).length
    busy = busy.filter((f) => f > t)
    doneTotal += finished

    // 2) waiting clients give up
    const retries: { enter: number; retried: boolean }[] = []
    if (cfg.timeoutSec != null) {
      const keep: typeof queue = []
      for (const r of queue) {
        if (t - r.enter >= cfg.timeoutSec) {
          timeoutsTotal++
          if (cfg.retryOnTimeout && !r.retried) retries.push({ enter: t, retried: true })
        } else keep.push(r)
      }
      queue = keep
    }

    // 3) arrivals (external + retries), against the cap
    const newExternal = cfg.pattern[t % cfg.pattern.length]
    let entered = 0
    for (let i = 0; i < newExternal; i++) {
      if (cfg.queueCap != null && queue.length >= cfg.queueCap) rejectedTotal++
      else {
        queue.push({ enter: t, retried: false })
        entered++
      }
    }
    for (const r of retries) {
      if (cfg.queueCap != null && queue.length >= cfg.queueCap) rejectedTotal++
      else {
        queue.push(r)
        entered++
      }
    }

    // 4) free workers pull from the queue (service = 1 s)
    while (busy.length < cfg.slots && queue.length > 0) {
      const req = queue.shift()!
      waitWindow.push({ t, w: t - req.enter })
      busy.push(t + 1)
    }

    enterWindow.push({ t, n: entered })
    queueWindow.push({ t, q: queue.length })
    while (waitWindow.length && waitWindow[0].t < t - WINDOW) waitWindow.shift()
    while (enterWindow.length && enterWindow[0].t < t - WINDOW) enterWindow.shift()
    while (queueWindow.length && queueWindow[0].t < t - WINDOW) queueWindow.shift()

    const avgWait = waitWindow.length
      ? waitWindow.reduce((a, x) => a + x.w, 0) / waitWindow.length
      : 0
    const lambda = enterWindow.reduce((a, x) => a + x.n, 0) / enterWindow.length
    const littleL = queueWindow.reduce((a, x) => a + x.q, 0) / queueWindow.length

    frames.push({
      t,
      newExternal,
      entered,
      queued: queue.length,
      inFlight: busy.length,
      donePerSec: finished,
      doneTotal,
      timeoutsTotal,
      rejectedTotal,
      avgWait: Math.round(avgWait * 10) / 10,
      lambda: Math.round(lambda * 10) / 10,
      littleL: Math.round(littleL * 10) / 10,
    })
  }
  return frames
}

// ── Metric tiles (the tappable evidence, analog to the flow explorer's stations) ─────────
export type TileId = 'neu' | 'zugaenge' | 'queue' | 'inflight' | 'durchsatz' | 'wartezeit' | 'fehler'

export const TILES: { id: TileId; label: string }[] = [
  { id: 'neu', label: 'Neu/s' },
  { id: 'zugaenge', label: 'Zugänge/s' },
  { id: 'queue', label: 'Warteschlange' },
  { id: 'inflight', label: 'In Arbeit' },
  { id: 'durchsatz', label: 'Fertig/s' },
  { id: 'wartezeit', label: 'Ø Wartezeit' },
  { id: 'fehler', label: 'Fehler' },
]

export function tileValue(f: Frame, id: TileId): number {
  switch (id) {
    case 'neu': return f.newExternal
    case 'zugaenge': return f.entered
    case 'queue': return f.queued
    case 'inflight': return f.inFlight
    case 'durchsatz': return f.donePerSec
    case 'wartezeit': return f.avgWait
    case 'fehler': return f.timeoutsTotal + f.rejectedTotal
  }
}

/** What the tile's detail panel explains — factual, no verdicts (IX-12). */
export const TILE_DETAIL: Record<TileId, string> = {
  neu: 'Externe Anfragen pro Sekunde, wie sie hereinkommen.',
  zugaenge: 'Was pro Sekunde tatsächlich in der Warteschlange landet: externe Anfragen plus automatische Retries.',
  queue: 'Anfragen, die auf einen freien Slot warten.',
  inflight: 'Anfragen, die gerade von einem der Slots bearbeitet werden.',
  durchsatz: 'Fertige Antworten pro Sekunde.',
  wartezeit: 'Durchschnittliche Wartezeit derer, die zuletzt einen Slot bekommen haben (Fenster: 15 s).',
  fehler: 'Timeouts (Wartende, die aufgegeben haben) plus 429 (an der vollen Schlange abgewiesen).',
}

// ── Guided protocol ───────────────────────────────────────────────────────────────────────
export interface LoadExperiment {
  id: string
  title: string
  config: SimConfig
  /** Config chips shown in the header — raw facts of this run. */
  chips: string[]
  watch: string
  prompt: string
  target: TileId
  solvedNote: string
  finding: string
  verdict: 'good' | 'bad' | 'blocked'
}

const BASE = { seconds: 45, slots: 2, queueCap: null as number | null, timeoutSec: null as number | null, retryOnTimeout: false }

export const LOAD_EXPERIMENTS: LoadExperiment[] = [
  {
    id: 'steady',
    title: 'Lauf 1 · normaler Dienstag',
    config: { ...BASE, pattern: [1, 2, 1, 1] },
    chips: ['Neu Ø 1,25/s', '2 Slots · 1 s/Antwort', 'Queue ∞', 'Timeout –', 'Retry aus'],
    watch: 'Beim Zuschauen: Wie voll werden die zwei Slots, und was sammelt sich davor an?',
    prompt: 'Eine Kachel zeigt über den ganzen Lauf praktisch dieselbe Zahl wie „Neu/s". Welche?',
    target: 'durchsatz',
    solvedNote: 'Fertig/s. Was reinkommt, kommt raus, die Schlange bleibt leer. So sieht ein stabiles System aus: Abfluss = Zufluss, mit Luft in den Slots.',
    finding: 'Stabil: Fertig/s = Neu/s, Schlange leer.',
    verdict: 'good',
  },
  {
    id: 'spike',
    title: 'Lauf 2 · der Launch-Post',
    config: { ...BASE, pattern: [3, 4, 3, 4] },
    chips: ['Neu Ø 3,5/s', '2 Slots · 1 s/Antwort', 'Queue ∞', 'Timeout –', 'Retry aus'],
    watch: 'Ankunft laut Log jetzt 3,5/s. Kapazität unverändert.',
    prompt: 'Die Wartezeit steigt und steigt. Welche andere Kachel wächst genauso, ohne je zu sinken?',
    target: 'queue',
    solvedNote: 'Die Warteschlange, um 1,5 pro Sekunde (3,5 rein, 2 raus). Kein Timeout der Welt ändert daran etwas. Die Formel unten rechnet live mit: Schlange ≈ Zugänge × Wartezeit (Little\'s Law).',
    finding: 'Ankunft > Kapazität: Schlange wächst grenzenlos.',
    verdict: 'bad',
  },
  {
    id: 'retry',
    title: 'Lauf 3 · der Fix aus dem Slack-Thread',
    config: { ...BASE, pattern: [3, 4, 3, 4], timeoutSec: 8, retryOnTimeout: true },
    chips: ['Neu Ø 3,5/s', '2 Slots · 1 s/Antwort', 'Queue ∞', 'Timeout 8 s', 'Retry an'],
    watch: 'Der Vorschlag aus dem Thread: Timeout 8 s plus ein automatischer Retry. Beobachten, was mit der Last passiert.',
    prompt: 'Extern kommen unverändert 3,5/s. Welche Kachel zeigt, dass sich das System zusätzliche Arbeit selbst erzeugt?',
    target: 'zugaenge',
    solvedNote: 'Zugänge/s liegt über Neu/s: Jeder Timeout stellt sich als Retry wieder hinten an. Das System bearbeitet Anfragen, deren Nutzer längst weg sind, und die Schlange wächst schneller als vorher.',
    finding: 'Retries unter Überlast erzeugen die Last, die sie beheben sollen.',
    verdict: 'bad',
  },
  {
    id: 'shed',
    title: 'Lauf 4 · der Gegenentwurf',
    config: { ...BASE, pattern: [3, 4, 3, 4], queueCap: 10 },
    chips: ['Neu Ø 3,5/s', '2 Slots · 1 s/Antwort', 'Queue max 10', 'Timeout –', 'Retry aus'],
    watch: 'Warteschlange auf 10 begrenzt. Was darüber hinausgeht, bekommt sofort 429 zurück.',
    prompt: 'Die Wartezeit bleibt jetzt dauerhaft unter 6 Sekunden. Welche Kachel bezahlt dafür?',
    target: 'fehler',
    solvedNote: 'Fehler, konkret 429 an der vollen Schlange. Wer drankommt, bekommt eine schnelle Antwort; wer nicht, erfährt es sofort statt nach Minuten. Backpressure heißt: die Grenze ehrlich nach außen melden.',
    finding: 'Queue-Limit + 429: Wartezeit endlich, Ablehnung ehrlich.',
    verdict: 'good',
  },
  {
    id: 'bursty',
    title: 'Lauf 5 · unter der Kapazität, trotzdem Stau',
    config: { ...BASE, pattern: [6, 0, 1, 0, 6, 0, 1, 1], seconds: 48 },
    chips: ['Neu Ø 1,9/s', '2 Slots · 1 s/Antwort', 'Queue ∞', 'Timeout –', 'Retry aus'],
    watch: 'Ankunft im Schnitt 1,9/s, unter der Kapazität. Aber nicht gleichmäßig. Auf die Spitzen achten.',
    prompt: 'Im Schnitt ist das System nicht überlastet. Welche Kachel zeigt, warum es trotzdem immer wieder Staus gibt?',
    target: 'neu',
    solvedNote: 'Neu/s springt zwischen 0 und 6. Der Durchschnitt lügt: Kapazität muss die Spitzen tragen, nicht den Mittelwert. Deshalb planen Seniors mit Luft (Faustregel: Dauerauslastung unter ~70–80 %).',
    finding: 'Auch unter Kapazität stauen Bursts. Der Durchschnitt lügt.',
    verdict: 'blocked',
  },
  {
    id: 'scale',
    title: 'Lauf 6 · das Budget-Gespräch',
    config: { ...BASE, pattern: [3, 4, 3, 4], slots: 4 },
    chips: ['Neu Ø 3,5/s', '4 Slots · 1 s/Antwort', 'Queue ∞', 'Timeout –', 'Retry aus'],
    watch: 'Gleicher Ansturm wie im Launch-Lauf. Das Provider-Tier wurde auf vier parallele Slots erhöht.',
    prompt: 'Im Launch-Lauf war eine Kachel bei 2 festgenagelt, egal wie groß der Andrang. Jetzt nicht mehr. Welche?',
    target: 'durchsatz',
    solvedNote: 'Fertig/s folgt wieder der Ankunft; die Decke liegt jetzt bei 4 statt 2. Skalieren ist der dritte Hebel neben Absagen und Streichen. Der bequemste, und der einzige, der jeden Monat auf der Rechnung steht.',
    finding: 'Mehr Slots heben die Decke. Gegen Geld.',
    verdict: 'good',
  },
]

// ── Free-play presets (deterministic patterns; the sandbox after the protocol) ────────────
export const RATE_PRESETS: { label: string; even: number[]; burst: number[] }[] = [
  { label: '1,2/s', even: [1, 1, 2, 1], burst: [4, 0, 1, 0] },
  { label: '2,4/s', even: [2, 3, 2, 3, 2], burst: [8, 0, 2, 0, 2] },
  { label: '3,5/s', even: [3, 4, 3, 4], burst: [10, 0, 4, 0] },
  { label: '5,0/s', even: [5], burst: [14, 2, 2, 2] },
]
export const SLOT_PRESETS = [1, 2, 3, 4]
export const CAP_PRESETS: (number | null)[] = [null, 10, 25]
export const TIMEOUT_PRESETS: (number | null)[] = [null, 8]
