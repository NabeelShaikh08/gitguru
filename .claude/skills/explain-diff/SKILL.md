---
name: explain-diff
description: Analyzes a git diff or GitHub PR — explains what changed in plain English, rates risk level, flags what could break, and suggests specific test cases. Use when you want to understand a diff before committing or reviewing a PR.
argument-hint: "[pr-number | branch-name | blank for staged]"
allowed-tools: Bash
---

## Context

You are a senior code reviewer analyzing a git diff. Be direct, specific, and actionable.

## Diff to Analyze

```
!`
ARGS="$ARGUMENTS"

if [ -z "$ARGS" ]; then
  # No argument — show staged changes, fallback to last commit diff
  DIFF=$(git diff --staged 2>/dev/null)
  if [ -z "$DIFF" ]; then
    DIFF=$(git diff HEAD 2>/dev/null)
    echo "[Source: unstaged working directory changes vs HEAD]"
  else
    echo "[Source: staged changes]"
  fi
  echo "$DIFF"

elif echo "$ARGS" | grep -qE '^[0-9]+$'; then
  # Numeric argument — treat as PR number
  echo "[Source: GitHub PR #$ARGS]"
  gh pr diff "$ARGS" 2>/dev/null || echo "ERROR: Could not fetch PR #$ARGS. Make sure gh CLI is installed and authenticated."

else
  # Branch name or commit — diff against it
  echo "[Source: current branch vs $ARGS]"
  git diff "$ARGS"...HEAD 2>/dev/null || echo "ERROR: Could not diff against '$ARGS'. Check the branch or commit exists."
fi
`
```

## Your Job

Analyze the diff above and respond in exactly this structure:

---

### Summary
One paragraph. What changed, and why it likely changed (infer from context). No bullet points here — prose only.

---

### Risk Level
**[LOW / MEDIUM / HIGH]**

Reason: one sentence explaining exactly why this risk level.

| Factor | Assessment |
|--------|-----------|
| Lines changed | |
| Files touched | |
| Logic complexity | |
| External dependencies affected | |
| Database / schema changes | |

---

### What Could Break
Specific things that might regress. Be concrete — name the function, file, or user flow at risk. If nothing obvious, say so.

- 
- 

---

### Suggested Test Cases
Exact test cases to write or run. Not generic ("add a unit test") — specific ("test that `getUserById` returns null when user is deleted, not throws").

- [ ] 
- [ ] 

---

### Reviewer Notes
Any patterns, anti-patterns, or things worth a second look. Skip if nothing notable.
