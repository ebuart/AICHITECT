import puppeteer from 'puppeteer-core'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const URL = 'http://localhost:5174/lesson/LESSON-01-03'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
const page = await browser.newPage()
await page.setViewport({ width: 1360, height: 900, deviceScaleFactor: 2 })
await page.goto(URL, { waitUntil: 'networkidle0' })
const click = async (text) => page.evaluate((t) => {
  const els = [...document.querySelectorAll('button')].filter((b) => b.textContent?.includes(t) && !b.disabled)
  const el = els[els.length - 1] // stations render after toggle chips — take the last match
  if (el) el.click()
  return els.length
}, text)
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
const shot = (name) => page.screenshot({ path: `docs/screenshots/${name}.png` })

await wait(600)
await shot('iter-proto-briefing')
await click('Lauf starten'); await wait(5400); await shot('iter-proto-diagnose')
await click('Tool-Gate'); await wait(300); await shot('iter-proto-solved')
await click('Weiter zu Lauf 2'); await wait(200); await click('Lauf starten'); await wait(3600)
await click('Modell'); await wait(250); await shot('iter-proto-miss') // deliberate wrong tap
await click('Check'); await wait(250)
await click('Weiter zu Lauf 3'); await wait(200); await click('Lauf starten'); await wait(3600)
await click('Context'); await wait(250)
await click('Weiter zu Lauf 4'); await wait(200); await click('Lauf starten'); await wait(3600)
await click('Tool-Gate'); await wait(250)
await click('Weiter zu Lauf 5'); await wait(200); await click('Lauf starten'); await wait(3600)
await click('Check'); await wait(250); await shot('iter-proto-final')
await click('Protokoll abschließen'); await wait(400)
await shot('iter-proto-free')
await browser.close()
console.log('done')
