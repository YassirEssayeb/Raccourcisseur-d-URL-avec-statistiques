import { chromium } from 'playwright'
import { spawn } from 'child_process'
import { setTimeout as sleep } from 'timers/promises'

const PORT = 5179

async function main() {
  console.log(`Starting Vite dev server on port ${PORT}...`)
  const server = spawn('npx.cmd', ['vite', '--port', String(PORT), '--strictPort'], {
    cwd: process.cwd(),
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true,
  })

  server.stderr.on('data', d => process.stderr.write(d))

  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Server start timeout')), 20000)
    server.stdout.on('data', data => {
      const text = data.toString()
      process.stdout.write(text)
      if (text.includes('Local:') || text.includes('ready in')) {
        clearTimeout(timeout)
        resolve()
      }
    })
    server.on('error', reject)
  })

  await sleep(1500)

  const BASE = `http://localhost:${PORT}`
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ deviceScaleFactor: 2 })
  const page = await context.newPage()

  const errors = []
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', err => errors.push(err.message))

  console.log('\n1. Navigating to landing page...')
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 })

  const url = page.url()
  if (!url.includes('/login')) {
    console.log('   -> On landing page (not redirected)')
  } else {
    console.log('   -> Redirected to /login')
  }

  console.log('2. Taking full-page screenshot...')
  await page.screenshot({ path: 'landing-full.png', fullPage: true })
  console.log('   -> Saved landing-full.png')

  console.log(`3. Page title: "${await page.title()}"\n`)

  console.log('4. Checking key elements:')
  const toCheck = [
    'nav', 'h1', 'footer',
    'a:has-text("Commencer")',
    'a:has-text("S\'inscrire")',
    'a:has-text("Connexion")',
    'section',
  ]
  const results = []
  for (const sel of toCheck) {
    const count = await page.locator(sel).count()
    const ok = count > 0
    results.push({ sel, ok, count })
  }
  for (const r of results) {
    console.log(`   ${r.ok ? 'OK' : 'MISSING'} ${r.sel} (found ${r.count})`)
  }

  console.log(`\n5. Console errors: ${errors.length ? errors.join(' | ') : 'none'}`)

  const visible = await page.locator('h1').isVisible().catch(() => false)
  console.log(`6. H1 visible: ${visible}`)

  await browser.close()
  server.kill()
  console.log('\nDone.')
}

main().catch(err => {
  console.error('FAILED:', err)
  process.exit(1)
})
