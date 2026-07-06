import puppeteer from 'puppeteer-core'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
const page = await browser.newPage()
await page.setViewport({ width: 1360, height: 1000, deviceScaleFactor: 2 })
await page.goto('http://localhost:5174/lesson/LESSON-14-01', { waitUntil: 'networkidle0' })
const click = async (t) => page.evaluate((x) => {
  const els = [...document.querySelectorAll('button')].filter((b) => b.textContent?.includes(x) && !b.disabled)
  els[els.length - 1]?.click()
}, t)
const waitText = (s) => page.waitForFunction((x) => document.body.innerText.includes(x), { timeout: 40000 }, s)
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const solve = async (tile) => { await click(tile); await wait(200); await click('melden'); await wait(250) }
await wait(400)
for (const f of ['monitoring/dienstag.log', '#status (Slack)', 'provider/limits.md']) { await click(f); await wait(120) }
await click('Lauf starten'); await waitText('dieselbe Zahl wie „Neu/s"'); await solve('Fertig/s')
await click('Weiter zu Lauf 2'); await wait(200); await click('Lauf starten'); await waitText('ohne je zu sinken'); await solve('Warteschlange')
await click('Weiter zu Lauf 3'); await wait(200); await click('Lauf starten'); await waitText('zusätzliche Arbeit'); await solve('Zugänge/s')
await click('Weiter zu Lauf 4'); await wait(200); await click('Lauf starten'); await waitText('bezahlt dafür'); await solve('Fehler')
await click('Weiter zu Lauf 5'); await wait(200); await click('Lauf starten'); await waitText('immer wieder Staus'); await solve('Neu/s')
await click('Weiter zu Lauf 6'); await wait(200); await click('Lauf starten'); await waitText('festgenagelt'); await solve('Fertig/s')
await click('Protokoll abschließen'); await wait(500)
const grid = await page.evaluateHandle(() => [...document.querySelectorAll('span')].find((s) => s.textContent?.startsWith('Protokoll 6/6'))?.parentElement)
await grid.asElement().screenshot({ path: 'docs/screenshots/dash-grid-only.png' })
await browser.close()
console.log('done')
