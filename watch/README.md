# GitGuru Watch Mode

Chokidar-based file watcher that auto-runs `/explain-diff` every time you save a file. Live diff analysis as you code — no manual typing.

## Setup

```bash
cd watch
npm install
node watch.js
```

## Usage

```bash
node watch.js              # watch current directory
node watch.js src/         # watch specific folder
node watch.js --debounce=1000  # custom debounce in ms (default 600ms)
```

Stop with `Ctrl+C`.

## How It Works

1. Chokidar watches your directory for file changes
2. When you save a file, a 600ms debounce timer starts
3. After the timer fires, it runs `git diff HEAD` on that file
4. If a diff exists, it runs `claude -p /explain-diff` automatically
5. You see the full risk analysis in your terminal without doing anything

## Requirements

- Node.js >= 18
- Claude Code installed (`claude` in PATH)
- Git initialized in the directory you're watching
