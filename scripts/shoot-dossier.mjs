import puppeteer from 'puppeteer-core'
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const URL = 'http://localhost:5174/lesson/LESSON-01-03'
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true })
const clickByText = async (page, text) => page.evaluate((t) => {
  const el = [...document.querySelectorAll('button')].find((b) => b.textContent?.includes(t))
  el?.click()
}, text)

let page = await browser.newPage()
await page.setViewport({ width: 1360, height: 900, deviceScaleFactor: 2 })
await page.goto(URL, { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 700))
await page.screenshot({ path: 'docs/screenshots/iter-dossier-1.png' })
// open the slack file, then the tool contract — reading like a user would
await clickByText(page, '#pricing-updates')
await new Promise((r) => setTimeout(r, 300))
await page.screenshot({ path: 'docs/screenshots/iter-dossier-slack.png' })
await clickByText(page, 'update_crm')
await new Promise((r) => setTimeout(r, 300))
await page.screenshot({ path: 'docs/screenshots/iter-dossier-tool.png' })
await page.close()

// mobile
page = await browser.newPage()
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true })
await page.goto(URL, { waitUntil: 'networkidle0' })
await new Promise((r) => setTimeout(r, 700))
await page.screenshot({ path: 'docs/screenshots/iter-dossier-mobile.png' })
await page.close()
await browser.close()
console.log('done')
