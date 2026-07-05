import puppeteer from 'puppeteer-core'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const URL = 'http://localhost:5174/lesson/LESSON-01-03'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
const page = await browser.newPage()
await page.setViewport({ width: 1360, height: 900, deviceScaleFactor: 2 })
await page.goto(URL, { waitUntil: 'networkidle0' })
const click = async (text) => page.evaluate((t) => {
  const els = [...document.querySelectorAll('button')].filter((b) => b.textContent?.includes(t) && !b.disabled)
  const el = els[els.length - 1]
  if (el) el.click()
  return els.length
}, text)
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const shot = (name) => page.screenshot({ path: `docs/screenshots/${name}.png` })
const solveRun = async (station) => { await click(station); await wait(200); await click('melden'); await wait(250) }

await wait(600); await shot('iter-gate-dossier-only')     // explorer must NOT be visible yet
await click('sales/faq.md'); await wait(200)
await click('update_crm'); await wait(200)
await click('#pricing-updates'); await wait(300)
await shot('iter-gate-unlocked')                           // all read → note + explorer appear
await click('Lauf starten'); await wait(5400)
await click('Modell'); await wait(250); await shot('iter-raw-payload')  // raw draft, no chewing
await solveRun('Tool-Gate'); await shot('iter-annotation') // note appears only now
await click('Weiter zu Lauf 2'); await wait(200); await click('Lauf starten'); await wait(3600)
await solveRun('Check')
await click('Weiter zu Lauf 3'); await wait(200); await click('Lauf starten'); await wait(3600)
await solveRun('Context')
await click('Weiter zu Lauf 4'); await wait(200); await click('Lauf starten'); await wait(3600)
await solveRun('Tool-Gate')
await click('Weiter zu Lauf 5'); await wait(200); await click('Lauf starten'); await wait(3600)
await solveRun('Check')
await click('Protokoll abschließen'); await wait(400); await shot('iter-gate-free')
await browser.close()
console.log('done')
