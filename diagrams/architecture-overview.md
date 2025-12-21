# Architecture Overview

## The Big Picture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    WHAT EXISTS (Dashboard)                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  React Frontend ←──────→ FastAPI Backend ←──────→ PostgreSQL Database   │
│  (localhost:5173)        (localhost:8000)         (Docker Container)    │
│                                                                           │
│  Components:             Routes:                  Tables:                │
│  ├─ HelpPage.tsx        ├─ /auth                 ├─ users              │
│  ├─ QuizPage.tsx        ├─ /help                 ├─ sessions           │
│  ├─ Overview.tsx        ├─ /question             ├─ questions          │
│  ├─ DocumentsPage.tsx   ├─ /answer               ├─ answers            │
│  ├─ AdminPage.tsx       ├─ /hygiene_score        ├─ documents          │
│  └─ Navbar.tsx          ├─ /document             ├─ hygiene_scores     │
│                          ├─ /control             ├─ controls           │
│                          └─ /health              └─ companies          │
│                                                                           │
│  Features Working Now:                                                   │
│  - Magic link authentication                                             │
│  - Training modules with quiz questions                                  │
│  - FAQ/Help system                                                       │
│  - Document management                                                   │
│  - User progress tracking                                                │
│  - Hygiene score calculations                                            │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ YOUR JOB: Add this
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     CHATBOT LAYER (New)                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ChatWidget.tsx ←──────→ /api/chat endpoint ←──────→ OpenAI API         │
│  (React Component)       (FastAPI Route)            (GPT-4/3.5)         │
│       │                       │                          │               │
│       │                       │                          │               │
│       │                       ▼                          │               │
│       │              Knowledge Base Builder              │               │
│       │              (Loads context from:)               │               │
│       │              ├─ FAQ content                      │               │
│       │              ├─ Training modules                 │               │
│       │              ├─ Assessment questions             │               │
│       │              ├─ Control frameworks               │               │
│       │              └─ User's current page              │               │
│       │                       │                          │               │
│       └──────────────────────┼──────────────────────────┘               │
│                                │                                          │
│                                ▼                                          │
│                        Response Handler                                  │
│                        ├─ Format answer                                  │
│                        ├─ Include sources                                │
│                        └─ Track conversation                             │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Layer-by-Layer Breakdown

### Layer 1: Existing Dashboard (Your Foundation)

**Frontend (React + TypeScript + Vite)**
- Runs on `localhost:5173` in development
- Uses React Router for navigation
- TypeScript for type safety
- Already has components for training modules, FAQ, documents
- Uses Axios for API calls to backend

**Backend (FastAPI + Python)**
- Runs on `localhost:8000`
- Handles authentication via magic links (email-based, no passwords)
- RESTful API with routes for questions, answers, documents, etc.
- Calculates hygiene scores based on user responses
- Uses SQLAlchemy ORM for database operations

**Database (PostgreSQL in Docker)**
- Stores all user data, training content, questions, answers
- Tracks user progress through modules
- Stores hygiene scores and assessments

**What This Means For You:**
- You don't need to build authentication - it exists
- You don't need to create training content - it's in the database
- You have a working foundation to build on top of

---

### Layer 2: Chatbot Layer (What You're Building)

**Frontend Component (ChatWidget.tsx)**
- A floating chat button (like Intercom/Drift)
- Chat interface that opens/closes
- Displays conversation history
- Sends user messages to backend
- Receives and displays AI responses

**Backend Route (/api/chat)**
- Receives user messages
- Builds context from knowledge base
- Calls OpenAI API with prompt + context
- Returns AI response to frontend
- Stores conversation history (optional)

**OpenAI Integration**
- Uses GPT-4 or GPT-3.5-turbo
- Receives prompts with cybersecurity context
- Returns intelligent responses
- Costs money per API call (track usage!)

**Knowledge Base Builder**
- Loads relevant content before each API call
- Pulls from FAQ database
- Includes training module content
- Can be context-aware (knows what page user is on)

---

## How They Connect

### User Flow Example:

```
1. User on "Password Security" training module
2. Clicks chat button (ChatWidget.tsx)
3. Types: "What's the difference between MFA and 2FA?"
4. Frontend sends POST to /api/chat with:
   - message: "What's the difference between MFA and 2FA?"
   - context: { page: "password-security", module_id: 5 }
5. Backend:
   a. Receives request
   b. Queries database for relevant FAQ + training content
   c. Builds prompt: "You are a cybersecurity expert... [context]... User asks: ..."
   d. Calls OpenAI API
   e. Gets response
   f. Returns to frontend
6. Frontend displays AI response in chat
```

### Data Flow:

```
User Input → ChatWidget → /api/chat → Knowledge Base → OpenAI → Response
                ↑                                                      ↓
                └──────────────────────────────────────────────────────┘
```

---

## Key Integration Points

### 1. Authentication
The chatbot needs to know who's logged in:
- Use existing session tokens from dashboard
- Access `current_user` in FastAPI routes (already exists)
- Personalize responses based on user progress

### 2. Knowledge Base
The chatbot needs to access existing content:
- Query `questions` table for FAQ data
- Query `controls` table for security frameworks
- Query `documents` table for training materials
- Use SQLAlchemy models that already exist in `/app/models`

### 3. Context Awareness
The chatbot should know where the user is:
- Frontend passes `current_page` or `module_id` with each request
- Backend uses this to filter relevant knowledge
- AI responses reference the specific module user is on

---

## What You Don't Need to Build

- Database schema (exists)
- Authentication system (exists)
- Training content (exists in DB)
- User management (exists)
- Frontend routing (exists)

## What You Do Need to Build

- Chat UI component
- `/api/chat` endpoint
- OpenAI integration logic
- Knowledge base loader
- Prompt engineering for cybersecurity context

---

## Success Criteria

When this is done:
1. User can click chat button from any page
2. User can ask cybersecurity questions
3. AI responds intelligently using training content
4. Responses are relevant to current module (context-aware)
5. Conversation feels natural and helpful

That's it. Everything else is bonus.
