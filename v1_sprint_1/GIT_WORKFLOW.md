# Git Workflow & Branch Strategy

## Quick Rules

1. **Always work on a feature branch** (never directly on main/develop)
2. **One feature = one branch** (not "everything I did this week")
3. **Clear branch names** (not "stuff" or "my-fixes")
4. **Pull request before merge** (get Arnett's approval)
5. **Main = always deployable** (clean, tested code only)

---

## Branch Naming Convention

### Format
```
[type]/[feature-name]
```

### Types
- `feature/` - New functionality (chatbot, UI, API)
- `fix/` - Bug fixes
- `refactor/` - Code cleanup (no functionality change)
- `docs/` - Documentation only
- `test/` - Test additions

### Examples
```
✅ Good:
feature/chatbot-backend-endpoint
feature/chat-ui-component
fix/answer-prevention-detection
docs/team-assignments
test/chatbot-edge-cases

❌ Bad:
feature/stuff
feature/my-work
fix/bug
chatbot
backend
my-changes
```

---

## Branching Structure

```
main (PROTECTED - deploy only)
  ↑
  └─ develop (staging - PR required)
      ↑
      ├─ feature/chatbot-backend (Michael)
      ├─ feature/chat-ui (Gabriel)
      ├─ feature/knowledge-base (Jared)
      ├─ fix/answer-seeking-detection (Arnett)
      └─ docs/rules-guidelines (Arnett)
```

---

## Workflow (Step by Step)

### 1. Get Latest Code
```bash
git checkout develop
git pull origin develop
```

### 2. Create Feature Branch
```bash
# Make sure you're on develop first
git checkout -b feature/your-feature-name
```

### 3. Make Changes & Commit
```bash
# Make your changes locally
# Test them
# Then commit:

git add .
git commit -m "Add chatbot backend endpoint"

# Good commit messages:
# - Clear what changed (not "stuff" or "fixes")
# - One commit per logical unit
# - Mention the feature/fix specifically
```

### 4. Push to Remote
```bash
git push origin feature/your-feature-name
```

### 5. Create Pull Request (PR)
On GitHub/GitLab:
- Click "Create Pull Request"
- Title: Clear description of what you did
- Description: Why? What changed? Any edge cases?
- Assign to: Arnett (for code review)

### 6. Wait for Approval
- Arnett reviews code
- May request changes
- Once approved → you can merge

### 7. Merge to Develop
```bash
# On GitHub, click "Merge" button
# Or manually:

git checkout develop
git pull origin develop
git merge feature/your-feature-name
git push origin develop
```

### 8. Clean Up
```bash
# Delete local branch
git branch -d feature/your-feature-name

# Delete remote branch (if GitHub)
git push origin --delete feature/your-feature-name
```

---

## Commit Message Format

### Template
```
[Type] Brief description (present tense, not past)

Optional detailed explanation:
- What changed
- Why it changed
- Any important notes
```

### Examples

**Good:**
```
[Feature] Add chatbot endpoint to backend

- Creates POST /api/chat endpoint
- Integrates OpenAI API
- Loads knowledge base from file
- Detects answer-seeking attempts
```

**Bad:**
```
fixed stuff

updated backend
```

---

## Working With Multiple People

### Scenario: Michael & Jared Both Work on Backend

```
develop
  ├─ feature/chatbot-endpoint (Michael)
  │   └─ POST /api/chat route
  │
  └─ feature/knowledge-base-loading (Jared)
      └─ File loading logic

# They're independent, both work from develop
# No merge conflicts expected (different files)
```

### Scenario: Both Work on Same File

**If collision risk:**
1. Communicate first ("Hey, I'm working on X")
2. Split work differently
3. Or one does local review before other starts

**If merge conflict happens:**
```bash
# Git will tell you there's a conflict
# Open the file, fix it manually
# Keep both changes (or decide which one)
# Commit the resolved version
git add .
git commit -m "Resolve merge conflict in X"
git push origin feature/branch-name
```

---

## Code Review Checklist (For Arnett)

When reviewing PRs, check:
- ✅ Code works (tested locally?)
- ✅ Follows guidelines in CHATBOT_RULES_GUIDELINES.md
- ✅ No API keys or secrets in code
- ✅ Error handling present
- ✅ Comments where logic is complex
- ✅ No unnecessary code
- ✅ Commit messages clear

### Common Review Comments
- "This looks good, merging!" → ✅ Approve
- "Can you add error handling here?" → Request changes
- "Why did you choose this approach?" → Ask question (discuss)
- "Let's chat about this design" → Comment (needs discussion)

---

## Protected Branches

### main
- **Protected:** Yes
- **Can push to:** Nobody directly
- **How to update:** PR from develop only
- **Requirement:** Arnet approves all PRs
- **Purpose:** Keep deployable version clean

### develop
- **Protected:** Yes (kind of)
- **Can push to:** Via PR only
- **Requirement:** Arnett approves all PRs
- **Purpose:** Staging area before main

### feature/* branches
- **Protected:** No
- **Can push to:** Yourself anytime
- **Purpose:** Work in progress

---

## Emergency Hotfix (If Main is Broken)

**ONLY if production is down:**

```bash
# 1. Create hotfix branch from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug-name

# 2. Fix the issue (minimal change)
# 3. Test thoroughly
# 4. Commit
git add .
git commit -m "[Hotfix] Fix critical issue"

# 5. Push & create PR
git push origin hotfix/critical-bug-name
# Create PR, mark as URGENT
# Get Arnett to review immediately

# 6. Once approved, merge to main
# 7. Also merge into develop (so fix isn't lost)
```

---

## Daily Workflow (For Everyone)

### Morning
```bash
# Start of day - get latest code
git checkout develop
git pull origin develop
git checkout feature/my-branch
git merge develop  # Stay up to date
```

### During Day
```bash
# Work on feature
# Test it locally
# When ready to commit:
git add .
git commit -m "[Feature] Clear description"
git push origin feature/my-branch
```

### End of Day
```bash
# Push your work (backup)
git push origin feature/my-branch

# Let team know you're done
# Post in Slack: "PRed feature/my-branch, ready for review"
```

---

## Recovering From Mistakes

### "I committed to wrong branch"
```bash
# Undo the commit (keep changes)
git reset --soft HEAD~1

# Switch to correct branch
git checkout feature/correct-branch

# Commit again
git commit -m "message"
git push
```

### "I pushed something I shouldn't have"
```bash
# If not merged yet - revert commit
git revert HEAD
git push

# If merged - talk to Arnett about reverting PR
```

### "I need latest main/develop"
```bash
git fetch origin
git pull origin develop
git merge develop
git push
```

---

## Team Norms

**Do:**
- ✅ Push your work regularly (don't lose it)
- ✅ Create PR when feature is ready
- ✅ Review others' code (learn from each other)
- ✅ Communicate in Slack if you need something
- ✅ Clean up your branches after merging

**Don't:**
- ❌ Commit directly to main or develop
- ❌ Force push without asking Arnett first
- ❌ Leave branches unmerged for weeks
- ❌ Commit API keys or secrets
- ❌ Create commits like "fix stuff" or "updates"

---

## Commands Reference

### Most Used
```bash
# Get latest
git pull origin develop

# Create branch
git checkout -b feature/name

# Check status
git status

# Stage changes
git add .

# Commit
git commit -m "message"

# Push
git push origin feature/name

# View history
git log --oneline
```

### Less Common But Useful
```bash
# See what's different
git diff

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Switch branches
git checkout other-branch

# Delete local branch
git branch -d feature/name

# Delete remote branch
git push origin --delete feature/name

# Merge another branch
git merge other-branch
```

---

## Git Workflow for Week 1

### Michael's Flow
```bash
git checkout -b feature/chatbot-backend
# ... implement /api/chat endpoint
git add .
git commit -m "[Feature] Add chatbot endpoint with OpenAI integration"
git push origin feature/chatbot-backend
# Create PR, get Arnett's approval, merge
```

### Gabriel's Flow
```bash
git checkout -b feature/chat-ui-component
# ... build ChatBot.tsx and ChatBot.css
git add .
git commit -m "[Feature] Add ChatBot React component with styling"
git push origin feature/chat-ui-component
# Create PR, get Arnett's approval, merge
```

### Jared's Flow
```bash
git checkout -b feature/knowledge-base-org
# ... organize training content
git add .
git commit -m "[Feature] Organize knowledge base for chatbot"
git push origin feature/knowledge-base-org
# Create PR, get Arnett's approval, merge
```

---

## Questions About Git

**"What do I do if..."**

| Problem | Solution |
|---------|----------|
| I made a mistake | Revert commit or ask Arnett |
| My branch is behind | `git merge develop` |
| I have merge conflicts | Ask for help, resolve manually |
| I can't push | Check permissions, contact Arnett |
| I lost my changes | Check `git log`, ask Arnett |
| I don't understand git | Ask your track lead, we'll walk through it |

---

## One More Time (The Rules)

1. **Create branch for each feature**
2. **Name branches clearly** (feature/what-you-did)
3. **Push regularly** (don't lose work)
4. **Create PR when ready** (not before)
5. **Get Arnett's approval** (before merge)
6. **Merge to develop** (then can delete branch)
7. **Main only gets merged when stable** (later)

Follow these and everything works.
Don't follow these and you'll have pain.

Choose the first one. 🚀
