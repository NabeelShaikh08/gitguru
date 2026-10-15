#!/bin/bash

# GitGuru — One-line installer
# Usage: curl -fsSL https://raw.githubusercontent.com/NabeelShaikh08/gitguru/main/install.sh | bash

set -e

SKILLS_DIR="$HOME/.claude/skills"
REPO_URL="https://raw.githubusercontent.com/NabeelShaikh08/gitguru/main"

echo ""
echo "  GitGuru — Claude Code Skills Installer"
echo "  ──────────────────────────────────────"
echo ""

# Create skills directory if it doesn't exist
mkdir -p "$SKILLS_DIR/explain-diff"
mkdir -p "$SKILLS_DIR/repo-onboard"

echo "  → Installing /explain-diff skill..."
curl -fsSL "$REPO_URL/.claude/skills/explain-diff/SKILL.md" \
  -o "$SKILLS_DIR/explain-diff/SKILL.md"
echo "    ✓ Done"

echo "  → Installing /repo-onboard skill..."
curl -fsSL "$REPO_URL/.claude/skills/repo-onboard/SKILL.md" \
  -o "$SKILLS_DIR/repo-onboard/SKILL.md"
echo "    ✓ Done"

echo ""
echo "  ✓ GitGuru installed successfully!"
echo ""
echo "  Available skills:"
echo "    /explain-diff              — analyze staged/local changes"
echo "    /explain-diff <pr-number>  — analyze a GitHub PR"
echo "    /explain-diff <branch>     — diff current branch vs another"
echo "    /repo-onboard              — generate onboarding docs for any repo"
echo ""
echo "  Optional: Watch mode (auto-runs /explain-diff on file save)"
echo "    cd $(dirname $0)/watch && npm install && node watch.js"
echo ""
echo "  Docs: https://github.com/NabeelShaikh08/gitguru"
echo ""
