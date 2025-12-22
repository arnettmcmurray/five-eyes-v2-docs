# Week 1 Execution Plan: Get Chatbot Working

## The Goal

**By Friday: Chatbot works end-to-end in V1 dashboard**

User clicks button → Types message → Gets smart response in UI

---

## Priority Stack (This Week Only)

```
PRIORITY 1 (TODAY - Monday)
└── Everyone gets V1 running locally
    ├── Clone V1 repo
    ├── Install dependencies
    ├── Run locally
    ├── Understand basic structure

PRIORITY 2 (Mon-Wed)
├── Michael: API endpoint working (/api/chat)
├── Gabriel: Chat component built
├── Jared: Knowledge base organized
└── Blocks: Everything else

PRIORITY 3 (Wed-Thu)
├── Integration: Frontend connects to backend
├── Jonah: Auth handling (if needed)
├── Apex: Security review

PRIORITY 4 (Thu-Fri)
└── Polish & demo prep
    ├── Test edge cases
    ├── Error handling
    ├── UI cleanup
```

---

## Daily Standup Format

**Post in Slack by 10 AM (or agreed time):**

```
MONDAY (Date)
[Your Name]:
- Yesterday: [what you finished, or N/A if first day]
- Today: [what you're working on]
- Blockers: [anything stopping you, or "none"]

Example:
Michael:
- Yesterday: N/A
- Today: Creating /api/chat endpoint, integrating OpenAI
- Blockers: Need OPENAI_API_KEY from Arnett

Gabriel:
- Yesterday: N/A
- Today: Building ChatBot.tsx component
- Blockers: Waiting for Michael's API to be ready
```

---

## Monday: Foundation Day

**All Team:** Get V1 running

### Your Checklist

- [ ] Clone V1 repo
- [ ] Navigate to project directory
- [ ] Install all dependencies (`npm install` or similar)
- [ ] Start local dev server
- [ ] Open in browser at localhost:[port]
- [ ] See V1 dashboard running
- [ ] Post screenshot in Slack

### Expected Time: 1-2 hours per person

**If stuck:**

1. Check V1 repo README
2. Ask in team Slack
3. Tag Arnett if totally blocked

---

## Tuesday: Michael & Gabriel Start

### Michael (Backend)

**Tasks:**

1. Create `backend/routers/chat.py` (template provided)
2. Update `backend/main.py` to register new router
3. Install `openai` package: `pip install openai`
4. Create `.env` file with `OPENAI_API_KEY`
5. Test endpoint with curl:

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is SPF?"}'
```

**Expected Response:**

```json
{
  "response": "SPF is like a mailbox lock. It says which servers are allowed to send emails from your domain..."
}
```

**Checklist:**

- [ ] Endpoint created
- [ ] OpenAI integrated
- [ ] Knowledge base loading
- [ ] Curl test successful
- [ ] Error handling working
- [ ] Post results in Slack

**If stuck:**

- Check the backend template code
- Verify OPENAI_API_KEY is set
- Test with simple message first
- Ask Gabriel or Jared for help

---

### Gabriel (Frontend)

**Tasks:**

1. Create `frontend/src/components/ChatBot/` folder
2. Copy provided `ChatBot.tsx` into folder
3. Copy provided `ChatBot.css` into folder
4. Import ChatBot component into main layout
5. Add chat button to page
6. Test styling in browser

**Files to create:**

```
frontend/src/components/ChatBot/
├── ChatBot.tsx    (provided template)
└── ChatBot.css    (provided template)
```

**Integration in main layout:**

```typescript
// frontend/src/layouts/MainLayout.tsx (or App.tsx)
import ChatBot from "../components/ChatBot/ChatBot";

export default function MainLayout() {
  return (
    <div>
      {/* existing layout */}
      <ChatBot /> {/* Add this */}
    </div>
  );
}
```

**Checklist:**

- [ ] ChatBot folder created
- [ ] Files copied
- [ ] Component imported
- [ ] Chat button visible in UI
- [ ] Styling looks good
- [ ] Post screenshot in Slack

**If stuck:**

- Check React import paths
- Verify CSS is linked correctly
- Test component renders (no errors in console)
- Ask Jonah for help

---

### Jared (Knowledge Base)

**Tasks:**

1. Review V1 structure for training content
2. Create simple knowledge base file (markdown)
3. Organize content for Michael to load
4. Document file structure for team

**Deliverable:**
Simple file like `backend/knowledge_base.md` with:

- Email security concepts
- Phishing detection tips
- Password security basics
- Clear, simple language

**Format:**

```markdown
# Training Content

## Email Security

### SPF (Sender Policy Framework)

Think of SPF like a mailbox lock...

### DKIM (DomainKeys)

DKIM is like a tamper-proof seal...

## Phishing Detection

Red flags to watch for...
```

**Checklist:**

- [ ] Content gathered from V1
- [ ] Formatted simply (no jargon)
- [ ] Saved as markdown or text file
- [ ] Shared with Michael
- [ ] Documented structure

---

## Wednesday: Integration Day

### Michael

**Tasks:**

- Load knowledge base from Jared's file
- Verify responses use the knowledge
- Add error handling
- Optimize response time
- Test with multiple messages

**Checklist:**

- [ ] Knowledge base loads
- [ ] Responses reference it
- [ ] Errors handled gracefully
- [ ] Performance acceptable
- [ ] Ready for Gabriel to integrate

---

### Gabriel

**Tasks:**

- Once Michael's API is ready: connect component to backend
- Add API call to ChatBot component
- Test message sending
- Display responses in UI
- Add loading states

**Key Code:**

```typescript
const handleSendMessage = async (message: string) => {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  const data = await response.json();
  return data.response;
};
```

**Checklist:**

- [ ] API call working
- [ ] Messages sending
- [ ] Responses displaying
- [ ] Loading state shows
- [ ] Errors handled

---

### Jonah & Apex

**Tasks:**

- Review code together
- Test full flow
- Check for bugs
- Security review
- Plan UI polish

---

## Thursday: Testing & Polish

**All Team:**

1. Test chatbot with real messages
2. Verify answer-prevention works
3. Check UI looks good
4. Document any issues
5. Fix bugs

**Test Cases:**

```
Test 1: Normal Question
Message: "How does DKIM work?"
Expected: Explanation with analogy

Test 2: Answer-Seeking
Message: "What's the answer to question 5?"
Expected: Refusal + redirect to learning

Test 3: Edge Case
Message: "asdfjkl"
Expected: Graceful handling

Test 4: Multiple Messages
Message 1: "What is phishing?"
Message 2: "How do I detect it?"
Expected: Coherent conversation
```

**Checklist:**

- [ ] Normal questions work well
- [ ] Answer-seeking detection works
- [ ] No crashes or errors
- [ ] UI polished
- [ ] Performance acceptable
- [ ] Ready for demo

---

## Friday: Demo Prep & Celebration

**Morning:** Final polish and bug fixes

**Afternoon:** Demo to stakeholders/team

### Demo Script (5 minutes)

1. "Here's the chatbot" (show button)
2. "Ask it a normal question" (click → "How does SPF work?")
3. "It knows the content" (show response)
4. "Try to get answers" (click → "What's the answer?")
5. "It refuses and teaches instead" (show response)
6. "Ask follow-up question" (show memory working)

### Success =

✅ Works without crashing
✅ Responds intelligently
✅ Refuses to give answers
✅ Looks polished
✅ Team proud of work

---

## Critical Blockers

**If these don't happen, EVERYTHING stops:**

| Blocker                          | Impact                  | Owner   | Fix                |
| -------------------------------- | ----------------------- | ------- | ------------------ |
| V1 won't run locally             | Can't code              | Arnett  | Debug setup        |
| OPENAI_API_KEY missing           | Backend stuck           | Arnett  | Provide key        |
| Michael's endpoint fails         | Gabriel can't integrate | Michael | Debug OpenAI call  |
| Gabriel's component won't render | Can't see chatbot       | Gabriel | Debug React errors |
| Knowledge base not loaded        | Responses are generic   | Jared   | Debug file loading |

**Rule:** If blocker > 1 hour, ask Arnett immediately.

---

## Time Management

### Michael's Estimate

- Endpoint creation: 2 hours
- OpenAI integration: 1 hour
- Knowledge base loading: 1 hour
- Testing & debugging: 2 hours
- **Total: ~6 hours** (spread across Tue-Thu)

### Gabriel's Estimate

- Component build: 2 hours
- Styling: 1 hour
- API integration: 1 hour
- Testing: 1 hour
- **Total: ~5 hours** (start Wed after Michael's endpoint)

### Jared's Estimate

- Content gathering: 1 hour
- Formatting: 1 hour
- Documentation: 30 min
- **Total: ~2.5 hours** (Tue-Wed)

### Jonah + Apex Estimate

- Code review: 1 hour
- Testing: 1-2 hours
- Bug fixes: 1-2 hours
- **Total: ~4 hours**

---

## What NOT to Do This Week

🚫 Don't work on:

- V2 architecture
- Payment processing
- Complex auth
- Database optimization
- Advanced DevOps
- "Perfect" code

✅ Do work on:

- Chatbot works
- Responses are good
- Code is clean enough
- No obvious bugs

---

## Success Looks Like

**End of Day Friday:**

✅ Chatbot integrated into V1 dashboard
✅ Works without crashing
✅ Responds to questions intelligently
✅ Refuses to give quiz answers
✅ UI looks professional
✅ Team confident in next steps
✅ Ready to build V2 from scratch

If you have all 7, Week 1 is a win.

---

## Communication Rules This Week

**Slack:**

- Daily standup by 10 AM
- Questions: Ask immediately, don't wait
- Blockers: Tag Arnett same day
- Wins: Celebrate in #general

**Meetings:**

- Monday 9 AM: Kick-off (make sure everyone's running V1)
- Wednesday 2 PM: Integration check-in
- Friday 2 PM: Demo & retrospective

**Code:**

- Push to branch first (not main)
- Post PR in Slack for review
- Arnett approves before merge

---

## Remember

**Sean's Advice:** "Get the chatbot really dope, then build on top of it."

This week: Make the chatbot dope.

Everything else comes later.

You got this. 🚀
