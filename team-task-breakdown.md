# Team Task Breakdown

## How to Divide Work

Once Priority 1 (everyone can run the dashboard) is complete, split into tracks based on strengths.

**Not everyone needs to code.** The Content track is valuable and less technical.

---

## The Tracks

### Frontend Track

**What they own:**
- Chat UI component (modal, sidebar, or floating button)
- Wiring component to backend API
- Displaying messages and loading states
- Context passing (current page/module)
- UI for questionnaire (Phase 4)

**Skills needed:**
- React
- Basic state management
- CSS/styling
- Understanding API calls

**Key files they'll touch:**
- `frontend/src/components/` - new ChatBot folder
- `frontend/src/hooks/` - new useChat hook
- `frontend/src/layouts/MainLayout.tsx` - add chat toggle

---

### Backend Track

**What they own:**
- API endpoint for chat (`POST /api/chat`)
- OpenAI integration
- Knowledge base loading and formatting
- Conversation history storage
- Content generation logic (Phase 4)

**Skills needed:**
- Python
- FastAPI basics
- Understanding OpenAI API
- Basic database operations

**Key files they'll touch:**
- `backend/app/routers/` - new chat.py
- `backend/app/services/` - new ai_service.py
- `backend/app/main.py` - register new router
- `backend/requirements.txt` - add openai package

---

### Integration Track

**What they own:**
- Making frontend and backend talk correctly
- User session handling
- Testing the full loop
- Debugging cross-layer issues
- Ensuring auth works with chat

**Skills needed:**
- Understanding both frontend and backend
- Debugging network requests
- Reading error messages across stack

**Key responsibilities:**
- First to test end-to-end after frontend + backend have basics
- Reports issues to appropriate track
- Validates that pieces connect properly

---

### Content Track

**What they own:**
- Organizing training content for bot consumption
- Designing questionnaire questions
- Defining output format for generated modules
- Testing chatbot responses for quality
- Writing demo script

**Skills needed:**
- Understanding the domain (cybersecurity training)
- Product thinking
- Writing/communication
- Less technical coding required

**Key responsibilities:**
- Review knowledge base files, understand structure
- Define what questions the questionnaire should ask
- Specify what a "generated training module" looks like
- QA the chatbot - does it give good answers?

---

## Suggested Assignments

| Team Size | Suggested Split |
|-----------|-----------------|
| 4 people | 1 Frontend, 1 Backend, 1 Integration, 1 Content |
| 5 people | 1 Frontend, 2 Backend, 1 Integration, 1 Content |
| 6 people | 2 Frontend, 2 Backend, 1 Integration, 1 Content |

Adjust based on team strengths. If someone is strong in both frontend and backend, put them on Integration.

---

## Cross-Track Collaboration

### Daily Check-ins
- "What did you finish?"
- "What are you working on?"
- "Are you blocked on anything?"

### Handoff Points
1. **Backend → Frontend**: "The endpoint is ready at POST /api/chat, here's the request/response format"
2. **Frontend → Integration**: "The component is built, ready to wire up"
3. **Content → Backend**: "Here's how the knowledge base should be formatted"

### Blockers
If you're blocked waiting for another track:
- Work on something else in your track
- Help the blocking track finish
- Don't sit idle

---

## What NOT to Assign

Nobody should be working on:
- Payment routes
- Complex auth systems
- Kubernetes configs
- "Architecture planning" without building

If someone has nothing to do in their track, they help another track - not scaffold future features.
