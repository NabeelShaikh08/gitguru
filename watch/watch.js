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
const { execSync, spawn } = require('child_process')
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
let claudeRunning = false

function getDiff(filePath) {
  try {
    // Try committed vs working tree first
    let diff = execSync('git diff HEAD -- ' + JSON.stringify(filePath), {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim()

    // Fix 2: fallback for new/untracked files — try unstaged diff
    if (!diff) {
      diff = execSync('git diff -- ' + JSON.stringify(filePath), {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
      }).trim()
    }

    // Fix 2: fallback for staged new files
    if (!diff) {
      diff = execSync('git diff --staged -- ' + JSON.stringify(filePath), {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe'],
      }).trim()
    }

    return diff
  } catch {
    return ''
  }
}

function runExplainDiff(filePath) {
  // Fix 1: skip if claude is already running — don't queue up multiple runs
  if (claudeRunning) {
    console.log('[gitguru] Skipping — analysis already running...')
    return
  }

  const rel = path.relative(process.cwd(), filePath)
  console.log(`\n[gitguru] File changed: ${rel}`)

  const diff = getDiff(filePath)

  if (!diff) {
    console.log('[gitguru] No diff detected (file may not be tracked by git yet — run git add first)')
    return
  }

  console.log('[gitguru] Running explain-diff...\n')
  console.log('─'.repeat(60))

  claudeRunning = true

  // Fix 1: use spawn (async, non-blocking) instead of execSync
  // This keeps the watcher alive and responsive while Claude runs
  const claude = spawn('claude', ['-p', '/explain-diff'], {
    stdio: 'inherit',
    shell: true,
  })

  claude.on('error', (err) => {
    if (err.code === 'ENOENT') {
      console.error('[gitguru] Error: claude CLI not found. Make sure Claude Code is installed.')
    } else {
      console.error('[gitguru] Error running explain-diff:', err.message)
    }
    claudeRunning = false
  })

  claude.on('close', (code) => {
    console.log('─'.repeat(60))
    if (code !== 0 && code !== null) {
      console.log(`[gitguru] explain-diff exited with code ${code}`)
    }
    claudeRunning = false
  })
}

const watcher = chokidar.watch(watchPath, {
  ignored: IGNORED,
  persistent: true,
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 200,
    pollInterval: 100,
  },
})

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
