# Priority Stack

## The Rule

**You cannot start something until its dependencies are proven working.**

Don't build UI for features that don't exist. Don't add auth to a chatbot that doesn't respond. Don't try to host something you can't run locally.

---

## The Stack

```
PRIORITY 1 (Non-negotiable foundation)
├── Dashboard runs locally for everyone
└── Blocks: Everything else

PRIORITY 2 (Core chatbot - this IS the project)
├── Backend: API endpoint calls OpenAI, returns response
├── Backend: Load knowledge base (FAQ, training content files)
├── Frontend: Chat component in UI (input, output, toggle)
├── Integration: Frontend talks to backend, displays responses
├── Depends on: Priority 1
└── Blocks: Priority 3, 4, 5

PRIORITY 3 (Smart chatbot - what makes it good)
├── Conversation memory (remembers what you said)
├── Context awareness (knows what page user is on)
├── User session connection (tied to logged-in user)
├── Depends on: Priority 2 fully working
└── Blocks: Nothing critical, but makes demo impressive

PRIORITY 4 (Builder engine - the stretch magic)
├── Questionnaire captures environment info
├── AI generates training content from answers
├── Chatbot loads generated content dynamically
├── Depends on: Priority 2, ideally Priority 3
└── Blocks: Nothing (this is the "wow" factor)

PRIORITY 5 (Polish + presentation)
├── Demo script
├── Error handling
├── UI cleanup
├── Depends on: Whatever you got working
└── Cut first if behind
```

---

## What Blocks What

| If this isn't done... | ...you can't do this |
|----------------------|---------------------|
| Dashboard running locally | Anything else |
| Backend chat endpoint | Frontend chat component |
| Knowledge base loading | Intelligent responses |
| Basic chatbot working | Conversation memory |
| Basic chatbot working | Context awareness |
| Basic chatbot working | User sessions |
| Core chatbot integrated | Builder engine |

---

## What to Cut (In Order)

When you're running out of time, cut in this order:

1. **Builder engine UI** - Keep it CLI or simple form, skip the fancy interface
2. **Multi-tenant/user management** - Just prove it works for one instance
3. **RAG implementation** - Simpler knowledge loading is fine for demo
4. **Conversation memory** - Nice but not essential for demo
5. **Context awareness** - Same - nice, not critical

---

## Never Cut

These are the absolute minimum for demo day:

- Working chatbot in the dashboard UI
- Chatbot that actually knows the training content
- User can click, ask a question, get an intelligent response

If you don't have these three things, you don't have a demo.

---

## Hard Checkpoints

### End of Week 1
- [ ] Everyone can run the dashboard locally
- [ ] Everyone understands the project structure

### End of Week 2
- [ ] Chatbot works end-to-end (click → ask → response)
- [ ] Chatbot knows the training content

### Week 3 Check
> **If Priority 2 isn't fully working, STOP EVERYTHING ELSE. All hands on Priority 2.**

### End of Week 3
- [ ] Smart features added (memory, context, sessions)
- [ ] Starting builder engine work

### Week 4
- [ ] Builder engine proof of concept
- [ ] Questionnaire → content generation working

### Week 5
- [ ] Polish and demo prep
- [ ] Practice the demo

---

## Parallel Work

Once Priority 1 is done, you can parallelize:

| Track | Works on | Can start when |
|-------|----------|----------------|
| Backend | Chat endpoint, OpenAI integration, knowledge loading | Priority 1 done |
| Frontend | Chat component, UI integration | Priority 1 done |
| Integration | Connecting frontend to backend | Backend + Frontend have basics |
| Content | Knowledge base organization, questionnaire design | Priority 1 done |

Everyone does Priority 1 together. Then split into tracks.
