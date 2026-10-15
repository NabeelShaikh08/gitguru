# Changelog

All notable changes to GitGuru are documented here.

---

## [1.1.0] — 2026-10-15

### Fixed
- `watch.js`: replaced blocking `execSync` with async `spawn` — watcher no longer freezes while Claude runs
- `watch.js`: added 3-level `git diff` fallback for new/untracked files (HEAD → unstaged → staged)
- `install.sh`: removed broken `$(dirname $0)` path — works correctly when piped via `curl | bash`
- `repo-onboard`: cross-platform directory tree — works on Unix, Git Bash, and Windows fallback

### Added
- `.gitignore` — prevents `node_modules/` and `package-lock.json` from being committed
- `version` field in both SKILL.md files — users can check installed vs latest version
- `CHANGELOG.md` — this file
- `uninstall.sh` — clean removal of both skills from `~/.claude/skills/`
- Empty bullet point guards in `explain-diff` output sections

---

## [1.0.0] — 2026-10-15

### Added
- `/explain-diff` skill — analyzes git diffs and GitHub PRs with risk level, regression warnings, specific test cases
- `/repo-onboard` skill — generates ARCHITECTURE.md, FLOW.md (Mermaid diagrams), QUICKSTART.md, KEY_FILES.md
- `watch/watch.js` — Chokidar v4 watch mode, auto-runs `/explain-diff` on file save
- `install.sh` — one-liner installer to `~/.claude/skills/`
- `marketplace.json` — Claude plugin marketplace manifest
