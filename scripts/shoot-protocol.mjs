import puppeteer from 'puppeteer-core'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const URL = 'http://localhost:5174/lesson/LESSON-01-03'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
const page = await browser.newPage()
await page.setViewport({ width: 1360, height: 900, deviceScaleFactor: 2 })
await page.goto(URL, { waitUntil: 'networkidle0' })
const click = async (text) => page.evaluate((t) => {
  const els = [...document.querySelectorAll('button')].filter((b) => b.textContent?.includes(t) && !b.disabled)
  els[els.length - 1]?.click()
}, text)
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const shot = (name) => page.screenshot({ path: `docs/screenshots/${name}.png` })
const solveRun = async (station) => { await click(station); await wait(200); await click('melden'); await wait(250) }

await wait(500)
for (const f of ['sales/faq.md', 'update_crm', '#pricing-updates']) { await click(f); await wait(150) }
await wait(300)
await click('Lauf starten'); await wait(3200); await shot('iter-road-running')
await wait(2400); await solveRun('Tool-Gate')
await click('Weiter zu Lauf 2'); await wait(200); await click('Lauf starten'); await wait(1200); await shot('iter-road-hole')
await wait(2600); await solveRun('Check')
await click('Weiter zu Lauf 3'); await wait(200); await click('Lauf starten'); await wait(3600)
await solveRun('Retrieval')
await click('Weiter zu Lauf 4'); await wait(200); await click('Lauf starten'); await wait(3600)
await solveRun('Modell')
await click('Weiter zu Lauf 5'); await wait(200); await click('Lauf starten'); await wait(3600)
await solveRun('Check'); await shot('iter-road-final')
await browser.close()
console.log('done')
