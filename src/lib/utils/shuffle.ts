// Returns a new array in random order (Fisher-Yates). Used to randomize option /
// answer order at render time so the correct choice is never in a fixed position — a
// position game ("first is always right") is a free win and an AI-authoring tell.
// Call once per mount (e.g. a useState initializer) so the order is stable during the
// exercise but fresh on the next visit.
export function shuffle<T>(input: readonly T[]): T[] {
  const arr = input.slice()
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}
