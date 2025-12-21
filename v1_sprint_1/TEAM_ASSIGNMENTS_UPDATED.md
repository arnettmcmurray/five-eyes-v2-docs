# Five Eyes Chatbot - Team Assignments (Updated)

## New Strategy
**V1 Update → Chatbot Works → V2 Clean Build**

We're ditching the complex planning. Focus: Get a working chatbot integrated into V1 by end of week, then build V2 from there.

---

## Team Roles

### Arnett McMurray (Lead)
**Role:** Project Lead, AI Integration, Decision-Making

**Responsibilities:**
- Own chatbot behavior and AI prompts
- Make architectural decisions
- Unblock team members
- Coordinate with stakeholders
- Code review + quality assurance

**Work:**
- Backend: Refine AI prompts, answer-prevention logic
- Review: All code before pushing to shared repo
- Guide: Answer questions, solve blockers

**Success Metric:** Chatbot is smart, doesn't give away answers, responses are quality

---

### Michael Rogers (Backend Lead)
**Role:** Backend Development

**Responsibilities:**
- Create /api/chat endpoint
- Integrate OpenAI API
- Load knowledge base and inject into prompts
- Handle errors gracefully
- Deploy to staging

**Work:**
- Implement `backend/routers/chat.py` (use template provided)
- Wire up OpenAI client with error handling
- Load knowledge base from files
- Test with curl before Frontend touches it

**Blockers You Own:**
- If Frontend can't call API → it's your problem
- If responses are slow → optimize
- If knowledge isn't being used → fix loading

**Success Metric:** POST /api/chat works end-to-end, returns relevant responses

---

### Gabriel (Frontend Lead)
**Role:** Frontend Development

**Responsibilities:**
- Build chat UI component (modal/sidebar)
- Wire component to Michael's API
- Make it look good and feel responsive
- Handle loading states and errors
- Display messages correctly

**Work:**
- Create `ChatBot.tsx` component (template provided)
- Add styles with `ChatBot.css`
- Import and add to main layout
- Test in browser

**Depends On:**
- Michael finishing /api/chat endpoint first
- Can't start integration until that's ready

**Success Metric:** User clicks button → types message → sees AI response in UI

---

### Jonah (Frontend / Auth)
**Role:** Frontend Support & Integration

**Responsibilities:**
- Help Gabriel with UI if needed
- Handle authentication with chatbot (if required)
- Test full user flow
- Fix bugs Gabriel/Michael report
- Polish the experience

**Work:**
- Support Gabriel with component architecture
- Ensure auth context flows to chat if needed
- Write integration tests
- Debug any UX issues

**Success Metric:** Smooth, polished UI experience, authentication works if required

---

### Jared (Backend / Database)
**Role:** Backend Support & Data

**Responsibilities:**
- Help Michael with backend if needed
- Structure knowledge base for easy loading
- Organize training content files
- Database queries if needed
- Help test API responses

**Work:**
- Organize knowledge base files (simple markdown/txt format)
- Help Michael with file loading logic
- Create test data for chatbot
- Document knowledge base structure

**Success Metric:** Knowledge base is well-organized, loads reliably, chatbot uses it correctly

---

### Apex (DevOps / Security)
**Role:** Infrastructure & Quality Assurance

**Responsibilities:**
- Ensure code quality
- Security review (API keys, data safety)
- Deployment strategy
- Performance monitoring
- CI/CD if applicable

**Work:**
- Review for security issues (API key handling, input validation)
- Monitor OpenAI usage and costs
- Ensure proper error handling
- Test with production-like data

**Success Metric:** Code is secure, no API keys in repo, graceful error handling

---

## Work Timeline

### Week 1: Get It Running

**Everyone:**
- [ ] Clone/access V1 repo
- [ ] Get V1 running locally
- [ ] Understand project structure

**Michael (Backend):**
- [ ] Create /api/chat endpoint
- [ ] Integrate OpenAI API
- [ ] Load knowledge base
- [ ] Test with curl

**Gabriel (Frontend):**
- [ ] Create ChatBot component
- [ ] Add to main layout
- [ ] Style it

**Jared:**
- [ ] Organize knowledge base files
- [ ] Help Michael with loading logic

**Jonah + Apex:**
- [ ] Code review
- [ ] Testing
- [ ] Security check

**Target:** Chatbot works end-to-end by Friday

---

### Week 2: Make It Smart

**Michael:**
- [ ] Add conversation memory (remembers context)
- [ ] Improve response quality
- [ ] Optimize performance

**Gabriel:**
- [ ] Add message history display
- [ ] Better UI/UX
- [ ] Mobile responsiveness

**Arnett:**
- [ ] Refine AI prompts
- [ ] Improve answer-prevention
- [ ] Test edge cases

**Everyone:**
- [ ] Demo to stakeholders
- [ ] Gather feedback

---

### Week 3+: V2 Planning

Once chatbot is solid on V1:
- Use V1 chatbot as reference
- Build clean V2 from scratch (new repo)
- Apply lessons learned

---

## Communication Rules

### Daily Standup (Async, 10 AM)
Post in Slack:
1. What did you finish yesterday?
2. What are you doing today?
3. Are you blocked?

### Handoff Points
1. **Michael → Gabriel:** "Endpoint is ready at POST /api/chat"
2. **Gabriel → Jonah:** "Component is built, ready to integrate"
3. **Everyone → Apex:** "Ready for security review"

### Blocker Protocol
- Blocked > 1 hour? Tag Arnett
- Blocked > 4 hours? Ping Michael or Gabriel
- Nobody sits idle - help another track if stuck

### Code Review
- All pull requests go through Arnett first
- Peer review after Arnett approves
- No commits directly to main

---

## What NOT to Do

**Skip These (for now):**
- Complex authentication systems
- Payment processing
- Kubernetes/advanced DevOps
- "Perfect" architecture
- Database optimization
- Caching layers (until we need it)

**Focus On:**
- Chatbot works
- Responses are good
- Code is clean
- No security issues

---

## Success Metrics

### By End of Week 1
- ✅ Everyone has V1 running locally
- ✅ /api/chat endpoint works (test with curl)
- ✅ Chat component displays in UI
- ✅ Can send message and get response

### By End of Week 2
- ✅ Chatbot knows the training content
- ✅ Responses reference knowledge base
- ✅ UI looks polished
- ✅ Can demo to stakeholders

### By End of Week 3
- ✅ Ready to build V2 from scratch
- ✅ Clear understanding of what works
- ✅ Team confident in execution

---

## Questions & Escalation

**"What should I work on?"**
→ Ask Arnett

**"What's blocking you?"**
→ Tell your track lead immediately

**"Can I work on [feature X]?"**
→ Get Arnett's approval first

**"We finished early, what's next?"**
→ Help other tracks or ask Arnett for stretch work

---

**Let's build this. Keep it simple, focus on execution. 🚀**
