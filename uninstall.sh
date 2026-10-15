#!/bin/bash

# GitGuru — Uninstaller
# Usage: bash uninstall.sh

SKILLS_DIR="$HOME/.claude/skills"

echo ""
echo "  GitGuru — Uninstaller"
echo "  ─────────────────────"
echo ""

if [ -d "$SKILLS_DIR/explain-diff" ]; then
  rm -rf "$SKILLS_DIR/explain-diff"
  echo "  ✓ Removed /explain-diff skill"
else
  echo "  — /explain-diff not found (already removed)"
fi

if [ -d "$SKILLS_DIR/repo-onboard" ]; then
  rm -rf "$SKILLS_DIR/repo-onboard"
  echo "  ✓ Removed /repo-onboard skill"
else
  echo "  — /repo-onboard not found (already removed)"
fi

echo ""
echo "  ✓ GitGuru uninstalled."
echo "  Note: any ARCHITECTURE.md / FLOW.md / QUICKSTART.md / KEY_FILES.md"
echo "  files generated in your repos are NOT deleted — remove them manually if needed."
echo ""
