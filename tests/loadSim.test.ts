import { describe, it, expect } from 'vitest'
import { LOAD_EXPERIMENTS, TILES, runSim, tileValue } from '@/features/explorers/loadSim/model'

const byId = Object.fromEntries(LOAD_EXPERIMENTS.map((e) => [e.id, e]))
const last = (id: string) => {
  const frames = runSim(byId[id].config)
  return { frames, end: frames[frames.length - 1] }
}

// Each run exists to demonstrate one law of systems under load. These assertions pin the
// laws to the simulation, so a config tweak cannot silently break the pedagogy.
describe('LoadSim — the five laws hold in the simulation', () => {
  it('steady: arrivals under capacity → queue stays empty, throughput = arrivals', () => {
    const { end } = last('steady')
    expect(end.queued).toBeLessThanOrEqual(1)
    expect(end.timeoutsTotal + end.rejectedTotal).toBe(0)
    // ~1.25/s over 45 s ≈ 56 arrivals, all served
    expect(end.doneTotal).toBeGreaterThanOrEqual(50)
  })

  it('spike: arrivals over capacity → the queue grows without bound (~1.5/s)', () => {
    const { frames, end } = last('spike')
    const mid = frames[Math.floor(frames.length / 2)]
    expect(end.queued).toBeGreaterThan(mid.queued)
    expect(end.queued).toBeGreaterThan(45) // ≈ 1.5/s × 45 s, minus ramp
    expect(end.avgWait).toBeGreaterThan(10)
  })

  it('retry: timeouts re-enter → the system generates load on top of external arrivals', () => {
    const { frames, end } = last('retry')
    // entered/s exceeds external rate once retries kick in
    const late = frames.slice(20)
    const avgEntered = late.reduce((a, f) => a + f.entered, 0) / late.length
    const avgExternal = late.reduce((a, f) => a + f.newExternal, 0) / late.length
    expect(avgEntered).toBeGreaterThan(avgExternal + 0.5)
    expect(end.timeoutsTotal).toBeGreaterThan(20)
  })

  it('shed: bounded queue + 429 → wait time bounded, rejections carry the cost', () => {
    const { frames, end } = last('shed')
    expect(Math.max(...frames.map((f) => f.queued))).toBeLessThanOrEqual(10)
    expect(Math.max(...frames.map((f) => f.avgWait))).toBeLessThanOrEqual(6)
    expect(end.rejectedTotal).toBeGreaterThan(30)
    expect(end.timeoutsTotal).toBe(0)
  })

  it('bursty: average below capacity, but bursts still queue (the average lies)', () => {
    const { frames, end } = last('bursty')
    const avgArrival = frames.reduce((a, f) => a + f.newExternal, 0) / frames.length
    expect(avgArrival).toBeLessThan(2) // under capacity on average
    expect(Math.max(...frames.map((f) => f.queued))).toBeGreaterThanOrEqual(3)
    expect(end.queued).toBeLessThanOrEqual(2) // drains between bursts — not a spiral
  })

  it('scale: four slots lift the ceiling — the same spike drains', () => {
    const { frames, end } = last('scale')
    expect(end.queued).toBeLessThanOrEqual(2)
    const late = frames.slice(20)
    const avgDone = late.reduce((a, f) => a + f.donePerSec, 0) / late.length
    expect(avgDone).toBeGreaterThan(3)
    expect(end.timeoutsTotal + end.rejectedTotal).toBe(0)
  })

  it("Little's Law: L ≈ λ·W in the steady part of the overloaded run", () => {
    const { frames } = last('spike')
    const f = frames[40]
    expect(f.littleL).toBeGreaterThan(0)
    const predicted = f.lambda * f.avgWait
    const ratio = f.littleL / predicted
    expect(ratio).toBeGreaterThan(0.5)
    expect(ratio).toBeLessThan(2)
  })
})

describe('LoadSim — protocol consistency (control/10 guards)', () => {
  it('five runs; every target tile exists; watch never names the target (IX-16)', () => {
    expect(LOAD_EXPERIMENTS).toHaveLength(6)
    for (const e of LOAD_EXPERIMENTS) {
      const tile = TILES.find((t) => t.id === e.target)
      expect(tile, `${e.id} target`).toBeTruthy()
      expect(e.watch.toLowerCase()).not.toContain(tile!.label.toLowerCase())
    }
  })

  it('the diagnosis is not readable from the config chips (IX-19 analog)', () => {
    for (const e of LOAD_EXPERIMENTS) {
      const tile = TILES.find((t) => t.id === e.target)!
      for (const chip of e.chips) {
        expect(chip.toLowerCase()).not.toContain(tile.label.toLowerCase())
      }
    }
  })

  it('every target tile actually carries signal in its run (non-constant or non-zero)', () => {
    for (const e of LOAD_EXPERIMENTS) {
      const frames = runSim(e.config)
      const values = frames.map((f) => tileValue(f, e.target))
      const distinct = new Set(values)
      expect(distinct.size > 1 || values[values.length - 1] > 0, `${e.id} target signal`).toBe(true)
    }
  })
})
