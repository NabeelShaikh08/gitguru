# GitGuru

Two Claude Code skills that make you and your team better developers.

---

## Skills Included

### `/explain-diff` — Understand any code change instantly
Analyzes your git diff or a GitHub PR and gives you:
- Plain English summary of what changed
- **Risk Level**: Low / Medium / High with exact reason
- What could break (specific functions, flows, edge cases)
- Concrete test cases to write

### `/repo-onboard` — Onboard any developer to any codebase in minutes
Points at any repo and generates four markdown files:
- `ARCHITECTURE.md` — what the project is and how pieces connect
- `FLOW.md` — Mermaid diagrams: system architecture, data flow, DB schema
- `QUICKSTART.md` — copy-paste setup guide with env vars table
- `KEY_FILES.md` — the 10-15 files every new dev must read

---

## Install

### One-liner (recommended)
```bash
curl -fsSL https://raw.githubusercontent.com/NabeelShaikh08/gitguru/main/install.sh | bash
```

### Manual
```bash
# Clone and copy skills to your global Claude skills folder
git clone https://github.com/NabeelShaikh08/gitguru
cp -r gitguru/.claude/skills/explain-diff ~/.claude/skills/
cp -r gitguru/.claude/skills/repo-onboard ~/.claude/skills/
```

### Plugin marketplace
```bash
claude plugin marketplace add NabeelShaikh08/gitguru
claude plugin install explain-diff
claude plugin install repo-onboard
```

---

## Usage

### `/explain-diff`

```bash
# Analyze your staged changes
/explain-diff

# Analyze your full working directory vs HEAD
/explain-diff

# Analyze a GitHub PR (requires gh CLI)
/explain-diff 42

# Diff current branch against main
/explain-diff main
```

**Example output:**
```
### Summary
This diff adds JWT token refresh logic to the auth middleware...

### Risk Level
**HIGH**
Reason: Modifies authentication flow that affects every protected route.

### What Could Break
- Sessions with expired tokens may get stuck in refresh loops
- logout() does not clear the refresh token from the DB

### Suggested Test Cases
- [ ] Test that a valid refresh token returns a new access token
- [ ] Test that an expired refresh token returns 401, not 500
- [ ] Test that logout invalidates both tokens
```

---

### `/repo-onboard`

```bash
# Run inside any cloned repo
/repo-onboard
```

This reads your actual source files and writes four markdown files to your repo root. The Mermaid diagrams in `FLOW.md` render directly on GitHub — no extra tools needed.

---

## Watch Mode (Chokidar)

Auto-run `/explain-diff` every time you save a file. Live diff analysis as you code.

```bash
cd gitguru/watch
npm install
node watch.js              # watch current directory
node watch.js src/         # watch specific folder
node watch.js --debounce=1000  # custom debounce (default 600ms)
```

Stop with `Ctrl+C`.

---

## Requirements

| Tool | Required | For |
|------|----------|-----|
| Claude Code | Yes | Running skills |
| git | Yes | All diff features |
| gh CLI | Optional | `/explain-diff <pr-number>` |
| Node.js 18+ | Optional | Watch mode only |

---

## Contributing

PRs welcome. If you add a new skill, follow the structure in `.claude/skills/` and update `marketplace.json`.

---

## License

MIT
