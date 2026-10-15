#!/usr/bin/env node

/**
 * GitGuru Watch Mode
 * Watches your working directory with Chokidar and auto-runs /explain-diff
 * every time you save a file. Gives you live diff analysis as you code.
 *
 * Usage:
 *   node watch.js              — watches current directory
 *   node watch.js src/         — watches specific folder
 *   node watch.js --debounce=1000  — custom debounce in ms (default 600)
 */

const chokidar = require('chokidar')
const { execSync } = require('child_process')
const path = require('path')
const os = require('os')

const args = process.argv.slice(2)
const watchPath = path.resolve(args.find(a => !a.startsWith('--')) || '.')
const debounceArg = args.find(a => a.startsWith('--debounce='))
const debounceMs = debounceArg ? parseInt(debounceArg.split('=')[1]) : 600

const IGNORED = [
  /node_modules/,
  /\.git/,
  /dist/,
  /build/,
  /\.next/,
  /\.nuxt/,
  /__pycache__/,
  /\.DS_Store/,
  /\.env/,
]

let debounceTimer = null
let lastFile = null

const watcher = chokidar.watch(watchPath, {
  ignored: IGNORED,
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 200,
    pollInterval: 100,
  },
})

function runExplainDiff(filePath) {
  const rel = path.relative(process.cwd(), filePath)
  console.log(`\n[gitguru] File changed: ${rel}`)
  console.log('[gitguru] Running explain-diff...\n')
  console.log('─'.repeat(60))

  try {
    const result = execSync('git diff HEAD -- ' + JSON.stringify(filePath), {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    if (!result.trim()) {
      console.log('[gitguru] No diff detected (file may not be tracked by git yet)')
      return
    }

    // Run claude with the explain-diff skill non-interactively
    execSync(`claude -p "/explain-diff" --no-interactive 2>&1`, {
      encoding: 'utf8',
      stdio: 'inherit',
    })
  } catch (err) {
    if (err.message.includes('claude: command not found')) {
      console.error('[gitguru] Error: claude CLI not found. Make sure Claude Code is installed.')
    } else {
      console.error('[gitguru] Error running explain-diff:', err.message)
    }
  }

  console.log('─'.repeat(60))
}

watcher
  .on('change', (filePath) => {
    lastFile = filePath
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => runExplainDiff(lastFile), debounceMs)
  })
  .on('add', (filePath) => {
    lastFile = filePath
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => runExplainDiff(lastFile), debounceMs)
  })
  .on('error', (err) => {
    console.error('[gitguru] Watcher error:', err)
  })
  .on('ready', () => {
    console.log(`[gitguru] Watch mode active — watching: ${path.resolve(watchPath)}`)
    console.log(`[gitguru] Debounce: ${debounceMs}ms | Ignoring: node_modules, .git, dist, build`)
    console.log('[gitguru] Save any file to auto-run /explain-diff\n')
  })

process.on('SIGINT', () => {
  console.log('\n[gitguru] Watch mode stopped.')
  watcher.close()
  process.exit(0)
})
