import puppeteer from 'puppeteer-core'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
const page = await browser.newPage()
await page.setViewport({ width: 1360, height: 900, deviceScaleFactor: 2 })
await page.goto('http://localhost:5174/lesson/LESSON-14-01', { waitUntil: 'networkidle0' })
const click = async (t) => page.evaluate((x) => {
  const els = [...document.querySelectorAll('button')].filter((b) => b.textContent?.includes(x) && !b.disabled)
  els[els.length - 1]?.click()
}, t)
const wait = (ms) => new Promise((r) => setTimeout(r, ms))
await wait(400)
for (const f of ['monitoring/dienstag.log', '#status (Slack)', 'provider/limits.md']) { await click(f); await wait(120) }
await click('Lauf starten')
// catch gliders mid-flight: shoot at sub-frame offsets a few times
await wait(3150); await page.screenshot({ path: 'docs/screenshots/glide-1.png' })
await wait(1120); await page.screenshot({ path: 'docs/screenshots/glide-2.png' })
await browser.close()
console.log('done')
