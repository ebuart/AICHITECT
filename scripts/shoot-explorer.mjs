// Iteration shots for the RequestFlowExplorer inside NODE-01-03 — idle state, after a full
// clean run, and after a run with retrieval off (the interesting failure). Desktop + mobile.
import puppeteer from 'puppeteer-core'

const BASE = process.argv[2] ?? 'http://localhost:5174'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const URL = `${BASE}/lesson/LESSON-01-03`

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
const clickByText = async (page, text) => {
  await page.evaluate((t) => {
    const btn = [...document.querySelectorAll('button')].find((b) => b.textContent?.includes(t))
    btn?.click()
  }, text)
}

try {
  // Desktop idle
  let page = await browser.newPage()
  await page.setViewport({ width: 1360, height: 900, deviceScaleFactor: 2 })
  await page.goto(URL, { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 800))
  await page.screenshot({ path: 'docs/screenshots/iter-explorer-idle.png' })

  // Clean run: send + wait for all steps
  await clickByText(page, 'Anfrage senden')
  await new Promise((r) => setTimeout(r, 5600))
  await page.screenshot({ path: 'docs/screenshots/iter-explorer-run.png' })

  // Failure run: retrieval off
  await clickByText(page, 'Retrieval')
  await clickByText(page, 'Nochmal senden')
  await new Promise((r) => setTimeout(r, 5600))
  await page.screenshot({ path: 'docs/screenshots/iter-explorer-fail.png' })
  await page.close()

  // Mobile idle + run
  page = await browser.newPage()
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true })
  await page.goto(URL, { waitUntil: 'networkidle0' })
  await new Promise((r) => setTimeout(r, 800))
  await clickByText(page, 'Anfrage senden')
  await new Promise((r) => setTimeout(r, 5600))
  await page.screenshot({ path: 'docs/screenshots/iter-explorer-mobile.png' })
  await page.close()
  console.log('done')
} finally {
  await browser.close()
}
