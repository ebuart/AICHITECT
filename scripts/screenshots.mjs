// Capture README screenshots from the local dev server using the system Chrome.
// Usage: node scripts/screenshots.mjs [baseUrl]   (default http://localhost:5174)
import puppeteer from 'puppeteer-core'

const BASE = process.argv[2] ?? 'http://localhost:5174'
const OUT = 'docs/screenshots'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const shots = [
  // The Werft is the landing view — give the canvas a beat to fit-to-view.
  { path: '/build', file: 'werft.png', width: 1440, height: 860, settle: 2500 },
  { path: '/roadmap', file: 'roadmap.png', width: 1440, height: 860, settle: 1500 },
  // A hard lesson with a spot exercise (prompt-injection PR review).
  { path: '/lesson/LESSON-08-03', file: 'lesson.png', width: 1440, height: 860, settle: 1500 },
  // Mobile lesson view — the exercise UI at phone width.
  { path: '/lesson/LESSON-02-01', file: 'lesson-mobile.png', width: 390, height: 844, settle: 1500, mobile: true },
]

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
try {
  for (const s of shots) {
    const page = await browser.newPage()
    await page.setViewport({ width: s.width, height: s.height, deviceScaleFactor: 2, isMobile: !!s.mobile })
    await page.goto(BASE + s.path, { waitUntil: 'networkidle0', timeout: 30_000 })
    await new Promise((r) => setTimeout(r, s.settle))
    await page.screenshot({ path: `${OUT}/${s.file}` })
    console.log(`✓ ${s.file}`)
    await page.close()
  }
} finally {
  await browser.close()
}
