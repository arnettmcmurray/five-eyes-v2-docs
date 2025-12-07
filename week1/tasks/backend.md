# Backend Tasks - Week 1

**Team:** Jonah Casablanca & Jarred Horshaw  
**Goal:** Choose LLM provider & design database

---

## Your Mission

1. Figure out which AI provider to use (Anthropic vs OpenAI)
2. Design new database tables for AI features

**By Friday, deliver:**

1. LLM comparison + recommendation
2. Database ERD
3. API endpoint spec
4. Working test script

---

## Tasks

### 1. Explore v1 Backend (Tuesday/Wednesday)

**What to do:**

- Clone v1 backend repo
- Understand FastAPI structure
- Map existing database schema (users, modules, questions)
- Note how auth works

**Deliverable:** 5-bullet summary of v1 (post in Slack)

---

### 2. Test LLM Providers (Wednesday/Thursday)

**Jonah - lead this**

**What to do:**

- Sign up for Anthropic Claude (free tier)
- Sign up for OpenAI (free $5 credit)
- Write simple Python scripts that call each API
- Test with questions like:
  - "Explain what phishing is"
  - "What's the answer to this question?" (should refuse)

**Deliverable:**

- Working Python scripts (one for each provider)
- Comparison doc: cost, speed, quality, ease of use
- Recommendation: Which one should we use and why?

---

### 3. Design Database Tables (Wednesday/Thursday)

**Jarred - lead this**

**What to do:**

- Design new tables:
  - `ai_sessions` (conversation sessions)
  - `ai_messages` (individual messages)
- Show relationships to existing v1 tables
- Create ERD (entity relationship diagram)

**Schema hints:**

```
ai_sessions:
- id (UUID)
- user_id (FK to users)
- context_type (home/module/question)
- module_id (optional FK)
- created_at, updated_at

ai_messages:
- id (UUID)
- session_id (FK to ai_sessions)
- sender (user/assistant/system)
- content (text)
- created_at
```

**Deliverable:** ERD diagram (draw.io or dbdiagram.io)

---

### 4. Write API Endpoint Spec (Thursday)

**Jarred - lead this**

**What to do:**

- Define `/api/ai/guide/message` endpoint
- Document:
  - Request format (what frontend sends)
  - Response format (what we return)
  - Error codes (401, 500, etc.)
  - Auth requirements

**Example:**

```
POST /api/ai/guide/message

Request:
{
  "user_id": 123,
  "message": "What is phishing?",
  "context": {"location": "module", "module_id": 5}
}

Response:
{
  "session_id": "uuid",
  "reply": "Phishing is...",
  "suggested_followups": ["Can you give an example?"]
}
```

**Deliverable:** API spec document (markdown)

---

## Acceptance Criteria

Your work is done when:

- ✅ You've tested both LLM providers
- ✅ You have a clear recommendation with reasoning
- ✅ Database design shows all necessary fields
- ✅ API spec is clear enough for frontend to integrate

---

## Resources

- Anthropic Claude: https://console.anthropic.com
- OpenAI: https://platform.openai.com
- v1 Backend Repo: [link shared Tuesday]
- dbdiagram.io: For ERDs

---

## Questions?

- **Frontend coordination:** Sync with Gabriel/Michael on API shape
- **Security:** Check with Oyewale on what data can go to LLM
- **Blocked:** Post in channel or DM Arnett

---

**Remember:** This week is research. Test, compare, document. Code comes Week 2.
