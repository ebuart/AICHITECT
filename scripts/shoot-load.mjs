import puppeteer from 'puppeteer-core'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const URL = 'http://localhost:5174/lesson/LESSON-14-01'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
const page = await browser.newPage()
await page.setViewport({ width: 1360, height: 1050, deviceScaleFactor: 2 })
await page.goto(URL, { waitUntil: 'networkidle0' })
const click = async (text) => page.evaluate((t) => {
  const els = [...document.querySelectorAll('button')].filter((b) => b.textContent?.includes(t) && !b.disabled)
  els[els.length - 1]?.click()
}, text)
const waitText = (s) => page.waitForFunction((x) => document.body.innerText.includes(x), { timeout: 40000 }, s)
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const shot = (name) => page.screenshot({ path: `docs/screenshots/${name}.png` })
const solve = async (tile) => { await click(tile); await wait(250); await click('melden'); await wait(300) }

await wait(500)
for (const f of ['monitoring/dienstag.log', '#status (Slack)', 'provider/limits.md']) { await click(f); await wait(150) }
await wait(300)
await click('Lauf starten'); await waitText('dieselbe Zahl wie „Neu/s"'); await solve('Fertig/s')
await click('Weiter zu Lauf 2'); await wait(400); await shot('dash-briefing-persist') // road frozen + 1 card
await click('Lauf starten'); await waitText('ohne je zu sinken'); await solve('Warteschlange')
await click('Weiter zu Lauf 3'); await wait(250)
await click('Lauf starten'); await waitText('zusätzliche Arbeit selbst erzeugt'); await solve('Zugänge/s')
await click('Weiter zu Lauf 4'); await wait(400); await shot('dash-3cards')
await click('Lauf starten'); await waitText('Welche Kachel bezahlt dafür'); await solve('Fehler')
await click('Weiter zu Lauf 5'); await wait(250)
await click('Lauf starten'); await waitText('warum es trotzdem immer wieder Staus gibt'); await solve('Neu/s')
await click('Weiter zu Lauf 6'); await wait(250)
await click('Lauf starten'); await waitText('bei 2 festgenagelt'); await solve('Fertig/s')
await click('Protokoll abschließen'); await wait(500)
await page.evaluate(() => window.scrollBy(0, 500)); await wait(200); await shot('dash-full-grid')
await browser.close()
console.log('done')
