# Phase 2: Core Chatbot - Integration Points

## Files to Create

### Backend

**Chat Router**
- Path: `/backend/routers/chat.py`
- Purpose: Handle chat endpoint logic
- Contains: POST /chat endpoint, OpenAI integration, knowledge base loading

**Pydantic Models (if separate)**
- Path: `/backend/models/chat.py` (optional)
- Purpose: Define request/response schemas
- Contains: ChatRequest, ChatResponse models

### Frontend

**Chat Component**
- Path: `/frontend/src/components/Chat/ChatInterface.tsx` (or .jsx)
- Purpose: Main chat UI component
- Contains: Message display, input handling, API calls

**Chat Toggle Button**
- Path: `/frontend/src/components/Chat/ChatToggle.tsx` (or .jsx)
- Purpose: Button to open/close chat
- Contains: Toggle logic, icon, positioning

**Chat Styles**
- Path: `/frontend/src/components/Chat/Chat.css` (or styled-components)
- Purpose: Chat interface styling
- Contains: Layout, colors, animations

## Files to Modify

### Backend

**main.py**
- Path: `/backend/main.py`
- Modification: Register new chat router
- Add:
  ```python
  from routers import chat
  app.include_router(chat.router, prefix="/api", tags=["chat"])
  ```

**requirements.txt**
- Path: `/backend/requirements.txt`
- Modification: Add OpenAI dependency
- Add:
  ```
  openai>=1.0.0
  ```

**.env or environment configuration**
- Path: `/backend/.env` or similar
- Modification: Add OpenAI API key
- Add:
  ```
  OPENAI_API_KEY=your-api-key-here
  ```

### Frontend

**Main Layout or App Component**
- Path: `/frontend/src/App.tsx` or `/frontend/src/layouts/MainLayout.tsx`
- Modification: Import and render chat components
- Add:
  ```javascript
  import ChatToggle from './components/Chat/ChatToggle';
  import ChatInterface from './components/Chat/ChatInterface';
  ```

**Navigation Component (optional)**
- Path: `/frontend/src/components/Navigation.tsx` (if toggle goes in nav)
- Modification: Add chat toggle button to nav bar
- Add: ChatToggle component to nav items

**package.json (if needed)**
- Path: `/frontend/package.json`
- Modification: Add any new dependencies
- Possible additions: axios, date-fns, or other utilities

## Where to Register New Router

### Backend Router Registration

In `/backend/main.py`, after existing router imports:

```python
# Existing routers
from routers import users, dashboard

# Add new chat router
from routers import chat

# Register routers
app.include_router(users.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(chat.router, prefix="/api")  # Add this line
```

Alternative pattern if using tags:

```python
app.include_router(
    chat.router,
    prefix="/api",
    tags=["chat"]
)
```

## Where to Add Chat Component

### Option 1: Global Layout

In main layout component that wraps all pages:

```javascript
function MainLayout({ children }) {
  return (
    <div>
      <Navigation />
      {children}
      <ChatToggle />
      <ChatInterface />
    </div>
  );
}
```

### Option 2: App Root

In App.tsx/jsx:

```javascript
function App() {
  return (
    <Router>
      <Routes>
        {/* Your routes */}
      </Routes>
      <ChatToggle />
      <ChatInterface />
    </Router>
  );
}
```

### Option 3: Specific Pages

Add to individual page components if chat should only appear on certain pages.

## How to Add Dependencies

### Backend Dependencies

1. Add to requirements.txt:
   ```
   openai>=1.0.0
   ```

2. Install:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

Or install directly:
```bash
pip install openai
```

### Frontend Dependencies

If you need additional packages (most likely not needed):

```bash
cd frontend
npm install axios  # if not using fetch
npm install date-fns  # for timestamp formatting
```

## Environment Variables

### Backend

Create or update `.env` file:

```
OPENAI_API_KEY=sk-...
```

Load in code:

```python
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
```

### Frontend

If API key needs to be in frontend (not recommended), use:

```
REACT_APP_OPENAI_API_KEY=sk-...
```

Better approach: Keep API key in backend only.

## Knowledge Base File Location

Specify where dashboard files are located:

```python
KNOWLEDGE_BASE_DIR = "/path/to/dashboard/files"
```

Or relative to project root:

```python
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
KNOWLEDGE_BASE_DIR = os.path.join(BASE_DIR, "dashboard")
```

## CORS Configuration (if needed)

If frontend and backend are on different ports during development, update CORS in `main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Testing Integration

After modifications, verify:

1. **Backend starts without errors**
   ```bash
   cd backend
   python main.py
   ```

2. **New endpoint appears in docs**
   - Visit http://localhost:8000/docs
   - Look for /api/chat endpoint

3. **Frontend builds successfully**
   ```bash
   cd frontend
   npm start
   ```

4. **Chat component renders**
   - Check browser console for errors
   - Verify toggle button appears

5. **Full flow works**
   - Open chat, send message, receive response

## Rollback Plan

If integration breaks:

1. Comment out router registration in main.py
2. Comment out chat component imports in frontend
3. Revert to working state
4. Debug issue in isolation
5. Re-integrate when fixed

## Common Integration Issues

- **Import errors**: Check file paths and exports
- **CORS errors**: Update CORS middleware
- **API key not found**: Verify .env file and loading
- **404 on endpoint**: Check router prefix and registration
- **Component not rendering**: Verify import and placement

Refer to error messages and console logs to diagnose issues.
