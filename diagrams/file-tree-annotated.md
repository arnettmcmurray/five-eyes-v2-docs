# Dashboard File Tree (Annotated)

This annotated file tree shows the dashboard project structure with markers for key files and where to add new components.

```
arnett-dashboard/
│
├─ compose/                    # Docker configs - IGNORE
│  ├─ .env.prod
│  └─ docker-compose.yml
│
├─ data/                       # ★ KEY: Static knowledge base
│  ├─ faq.json                 # ★ Chatbot FAQ data
│  ├─ categories.json          # ★ Module/control categories
│  ├─ questions.json           # ★ Quiz questions
│  └─ controls.json            # ★ NIST 800-53 controls
│
├─ frontend/
│  ├─ public/
│  │  ├─ index.html
│  │  └─ favicon.ico
│  │
│  ├─ src/
│  │  ├─ components/
│  │  │  ├─ MainLayout.jsx    # ★ KEY: Main app layout
│  │  │  ├─ Navigation.jsx    # Top nav bar
│  │  │  ├─ Sidebar.jsx       # Left sidebar
│  │  │  ├─ ChatWindow.jsx    # 🆕 ADD: Chat UI component
│  │  │  ├─ ModuleCard.jsx    # Training module cards
│  │  │  └─ QuizComponent.jsx # Quiz interface
│  │  │
│  │  ├─ pages/
│  │  │  ├─ Dashboard.jsx     # ★ KEY: Main dashboard page
│  │  │  ├─ Training.jsx      # Training modules page
│  │  │  ├─ Audit.jsx         # Audit log page
│  │  │  └─ Reports.jsx       # Reports page
│  │  │
│  │  ├─ services/
│  │  │  ├─ api.js            # ★ KEY: API client
│  │  │  └─ chat.js           # 🆕 ADD: Chat API service
│  │  │
│  │  ├─ App.jsx              # ★ KEY: Root component
│  │  ├─ index.js             # Entry point
│  │  └─ routes.js            # Route definitions
│  │
│  ├─ package.json            # ★ Dependencies
│  └─ vite.config.js          # Build config
│
├─ backend/
│  ├─ app/
│  │  ├─ routers/
│  │  │  ├─ dashboard.py      # Dashboard endpoints
│  │  │  ├─ training.py       # Training endpoints
│  │  │  ├─ audit.py          # Audit endpoints
│  │  │  └─ chat.py           # 🆕 ADD: Chat endpoints
│  │  │
│  │  ├─ services/
│  │  │  ├─ data_service.py   # ★ KEY: Loads data/ files
│  │  │  ├─ user_service.py   # User management
│  │  │  └─ ai_service.py     # 🆕 ADD: OpenAI integration
│  │  │
│  │  ├─ models/
│  │  │  ├─ user.py           # User model
│  │  │  ├─ progress.py       # User progress model
│  │  │  └─ conversation.py   # 🆕 ADD: Chat history model
│  │  │
│  │  ├─ config.py            # ★ KEY: App configuration
│  │  └─ main.py              # ★ KEY: FastAPI app entry
│  │
│  ├─ requirements.txt        # ★ Python dependencies
│  └─ .env                    # ★ Environment variables
│
├─ clients/                   # 🆕 Phase 4: Custom instances
│  ├─ acme-corp/
│  │  ├─ config.json
│  │  ├─ modules/
│  │  ├─ quizzes/
│  │  └─ knowledge.json
│  │
│  └─ widgets-inc/
│     └─ ...
│
├─ builder/                   # 🆕 Phase 4: Builder engine
│  ├─ templates/
│  │  ├─ modules/
│  │  ├─ quizzes/
│  │  └─ knowledge/
│  │
│  ├─ questionnaire/
│  │  └─ schema.json
│  │
│  └─ engine/
│     ├─ generator.py         # AI content generation
│     └─ deployer.py          # Instance deployment
│
├─ tests/                     # Test files
│  ├─ test_api.py
│  └─ test_chat.py
│
├─ .gitignore                 # ★ Git ignore rules
├─ README.md                  # ★ Project documentation
└─ docker-compose.yml         # Local development setup
```

## Key File Annotations

### ★ KEY FILES (Must Understand)

**`/backend/app/main.py`**
- FastAPI application entry point
- Router registration (where to add `chat.py` router)
- Middleware configuration
- CORS setup

**`/backend/app/config.py`**
- Environment variables (OpenAI API key)
- Database connection
- Feature flags

**`/backend/app/services/data_service.py`**
- Loads JSON files from `/data/` folder
- Used by chatbot to access FAQ, categories, controls
- Current methods: `load_faq()`, `load_categories()`

**`/frontend/src/components/MainLayout.jsx`**
- Main app shell
- Where to add chat icon trigger
- Sidebar and navigation structure

**`/frontend/src/services/api.js`**
- Axios instance for API calls
- Where to add chat API methods
- Error handling

**`/data/*.json`**
- Static knowledge base for chatbot
- Edit to update chatbot knowledge
- Must be valid JSON

### 🆕 FILES TO ADD (Chat Feature)

**Frontend:**
```
/frontend/src/components/ChatWindow.jsx
/frontend/src/services/chat.js
```

**Backend:**
```
/backend/app/routers/chat.py
/backend/app/services/ai_service.py
/backend/app/models/conversation.py
```

**Configuration:**
```
/backend/.env  (add OPENAI_API_KEY)
```

### Phase 4 Files (Future)

**Client Instances:**
```
/clients/{client_name}/
├─ config.json
├─ modules/
├─ quizzes/
└─ knowledge.json
```

**Builder Engine:**
```
/builder/engine/generator.py
/builder/templates/
/builder/questionnaire/
```

## Where to Add Code

### 1. Chat UI Component
**File:** `/frontend/src/components/ChatWindow.jsx`
```jsx
// New React component
// Floating chat window with:
// - Message list
// - Input field
// - Send button
// - Loading state
```

### 2. Chat API Service
**File:** `/frontend/src/services/chat.js`
```javascript
// API methods:
// - sendMessage(message, context)
// - getHistory(conversationId)
// - clearHistory()
```

### 3. Chat Backend Router
**File:** `/backend/app/routers/chat.py`
```python
# FastAPI router with:
# - POST /api/chat
# - GET /api/chat/history
# - DELETE /api/chat/history
```

### 4. AI Service
**File:** `/backend/app/services/ai_service.py`
```python
# OpenAI integration:
# - build_prompt()
# - call_openai()
# - format_response()
```

### 5. Register Router
**File:** `/backend/app/main.py`
```python
# Add to existing file:
from app.routers import chat

app.include_router(chat.router, prefix="/api/chat")
```

## Files to Ignore

**Deployment/Infrastructure:**
- `/compose/` - Production Docker configs
- `docker-compose.yml` - Local dev only
- `.env.prod` - Production environment

**Build Artifacts:**
- `/frontend/dist/` - Build output
- `/frontend/node_modules/` - Dependencies
- `__pycache__/` - Python cache

**Tests (for now):**
- `/tests/` - Will add later

## Data Flow Through Files

```
User clicks chat icon
    ↓
MainLayout.jsx triggers ChatWindow.jsx
    ↓
ChatWindow.jsx calls chat.js.sendMessage()
    ↓
chat.js POSTs to /api/chat (routers/chat.py)
    ↓
chat.py calls ai_service.py.get_response()
    ↓
ai_service.py loads data via data_service.py
    ↓
ai_service.py calls OpenAI API
    ↓
Response returns through chain
    ↓
ChatWindow.jsx displays response
```

## Quick Reference

**Add new data for chatbot:**
Edit `/data/faq.json`

**Change chatbot behavior:**
Edit `/backend/app/services/ai_service.py` (system prompt)

**Update chat UI:**
Edit `/frontend/src/components/ChatWindow.jsx`

**Add new API endpoint:**
1. Add to `/backend/app/routers/chat.py`
2. Register in `/backend/app/main.py`
3. Add method to `/frontend/src/services/chat.js`
