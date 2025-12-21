# How the Dashboard Works

This guide explains the architecture of the inherited dashboard codebase. Understanding this helps you know where to look when adding features or fixing bugs.

## The Big Picture

The dashboard is a **full-stack web application** with three main parts:

1. **Frontend (React)** - What users see and interact with in their browser
2. **Backend (FastAPI)** - Handles requests, business logic, database access
3. **Data Layer (Postgres + Redis)** - Stores data and sessions

```
User's Browser
    ↕ (HTTP requests)
Frontend (React)
    ↕ (API calls to localhost:8000)
Backend (FastAPI)
    ↕ (SQL queries)
Database (Postgres + Redis)
```

All three run in Docker containers, but that's just for convenience. The actual architecture is client-server.

## FastAPI Backend Structure

The backend is written in Python using FastAPI. Here's how it's organized:

### Routers Handle Requests

**Location:** `backend/app/routers/`

Routers define API endpoints (URLs) that the frontend can call.

```python
# routers/chat.py
from fastapi import APIRouter

router = APIRouter()

@router.post("/chat/send")
async def send_message(message: str):
    # Handle the request
    return {"response": "Hello!"}
```

This creates an endpoint at `POST /chat/send`.

**Think of routers as:** The reception desk. They receive requests and decide what to do with them.

### Services Have Logic

**Location:** `backend/app/services/`

Services contain the actual business logic. Routers call services to do the real work.

```python
# services/chat_service.py
class ChatService:
    def process_message(self, message: str) -> str:
        # Load knowledge base
        # Call OpenAI API
        # Return response
        return response
```

**Think of services as:** The employees who actually do the work. They don't talk to customers directly.

### Models Define Data

**Location:** `backend/app/models/`

Models define the shape of your data, both for the database and API requests/responses.

```python
# models/chat.py
from pydantic import BaseModel

class ChatMessage(BaseModel):
    user_id: int
    message: str
    timestamp: datetime
```

**Think of models as:** Forms and templates. They ensure data has the right fields and types.

### Database Access

**Location:** `backend/app/database.py` and `models/`

SQLAlchemy handles database connections. Models define tables.

```python
# models/user.py
from sqlalchemy import Column, Integer, String
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True)
    name = Column(String)
```

### Flow Example

User sends a chat message:

```
1. Frontend: POST /api/chat/send {"message": "What are office hours?"}
   ↓
2. Router (routers/chat.py): Receives request
   ↓
3. Router calls Service (services/chat_service.py)
   ↓
4. Service:
   - Loads knowledge base from database
   - Calls OpenAI API
   - Saves conversation to database
   ↓
5. Service returns response to Router
   ↓
6. Router returns JSON to Frontend
   ↓
7. Frontend displays response to user
```

## React Frontend Structure

The frontend is written in JavaScript/TypeScript using React.

### Pages Are Routes

**Location:** `frontend/src/pages/`

Each page corresponds to a URL route in the app.

```
/              → pages/Home.jsx
/chat          → pages/Chat.jsx
/admin         → pages/Admin.jsx
```

**Think of pages as:** Different screens in the app.

### Components Are Reusable

**Location:** `frontend/src/components/`

Components are reusable UI pieces used across pages.

```jsx
// components/MessageBubble.jsx
export function MessageBubble({ message, isUser }) {
    return (
        <div className={isUser ? "user-message" : "bot-message"}>
            {message}
        </div>
    );
}
```

Used like:

```jsx
<MessageBubble message="Hello!" isUser={true} />
```

**Think of components as:** LEGO blocks you can reuse anywhere.

### Hooks Manage State and Effects

React hooks handle data and side effects:

**useState** - Store data that changes:

```jsx
const [messages, setMessages] = useState([]);
```

**useEffect** - Do something when component loads or data changes:

```jsx
useEffect(() => {
    // Fetch messages when component loads
    fetchMessages();
}, []);
```

**Custom hooks** - Reusable logic:

```jsx
function useAuth() {
    const [user, setUser] = useState(null);
    // Auth logic here
    return { user, login, logout };
}
```

### How Frontend and Backend Communicate

The frontend makes HTTP requests to the backend:

```jsx
// In a React component
async function sendMessage(message) {
    const response = await fetch("http://localhost:8000/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    });

    const data = await response.json();
    return data.response;
}
```

The backend returns JSON, and the frontend updates the UI.

## Auth Flow: Magic Links

The dashboard uses **magic link authentication** (no passwords).

### How It Works

1. User enters email on login page
2. Backend generates a unique token and sends email with link
3. User clicks link with token: `https://app.com/auth?token=abc123`
4. Backend validates token, creates session
5. Frontend stores session (cookie or localStorage)
6. Subsequent requests include session token

### Where This Happens

**Backend:**
- `routers/auth.py` - Login endpoints
- `services/auth_service.py` - Token generation, email sending
- `services/email_service.py` - Actually sends emails

**Frontend:**
- `pages/Login.jsx` - Email input form
- `pages/AuthCallback.jsx` - Handles the magic link redirect
- `hooks/useAuth.jsx` - Manages logged-in state

### Session Storage

Sessions are stored in **Redis** (fast key-value store):

```python
# Store session
redis.setex(f"session:{token}", 3600, user_id)  # Expires in 1 hour

# Check session
user_id = redis.get(f"session:{token}")
```

Why Redis? It's faster than Postgres for temporary data like sessions.

## Database Roles

### Postgres (Persistent Data)

**What it stores:**
- Users
- Conversations
- Messages
- Knowledge base documents
- Anything that needs to persist long-term

**Why Postgres:**
- Relational data (users have conversations, conversations have messages)
- SQL queries for complex lookups
- ACID guarantees (data consistency)

### Redis (Temporary Data)

**What it stores:**
- Sessions (logged-in users)
- Cache (expensive queries)
- Rate limiting counters
- Anything temporary or fast-access

**Why Redis:**
- Extremely fast (in-memory)
- Built-in expiration (auto-delete old sessions)
- Simple key-value access

## Request Flow Example

Let's trace a complete request: "User logs in and sends a chat message"

### 1. Login

```
Frontend (Login.jsx):
  User enters email → POST /auth/login {"email": "user@example.com"}

Backend (routers/auth.py):
  → auth_service.send_magic_link(email)

Backend (services/auth_service.py):
  → Generate token
  → Save to Redis: "magic_link:abc123" → email
  → email_service.send_email(email, token)

User's Email:
  Click link → Frontend (AuthCallback.jsx) receives token

Frontend:
  GET /auth/verify?token=abc123

Backend (routers/auth.py):
  → Check Redis for token
  → Create session in Redis: "session:xyz789" → user_id
  → Return session token to Frontend

Frontend:
  Store session token → User is logged in
```

### 2. Send Chat Message

```
Frontend (Chat.jsx):
  User types message → POST /chat/send
  Headers: { "Authorization": "Bearer xyz789" }
  Body: { "message": "What are office hours?" }

Backend (routers/chat.py):
  → Check session in Redis
  → chat_service.process_message(user_id, message)

Backend (services/chat_service.py):
  → Load knowledge base from Postgres
  → Call OpenAI API
  → Save conversation to Postgres
  → Return response

Backend → Frontend:
  { "response": "Office hours are Tuesdays 2-4pm." }

Frontend (Chat.jsx):
  Update UI with new message
```

## Architecture Diagram

```
┌─────────────────────────────────────┐
│         User's Browser              │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  React Frontend              │  │
│  │  - Pages (routes)            │  │
│  │  - Components (UI)           │  │
│  │  - Hooks (state/effects)     │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
              ↕ HTTP (fetch)
┌─────────────────────────────────────┐
│      FastAPI Backend                │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  Routers (endpoints)         │  │
│  │  ↓                           │  │
│  │  Services (business logic)   │  │
│  │  ↓                           │  │
│  │  Models (data shapes)        │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
         ↕                    ↕
┌─────────────────┐   ┌─────────────────┐
│   Postgres      │   │     Redis       │
│  (persistent)   │   │   (temporary)   │
│  - Users        │   │   - Sessions    │
│  - Messages     │   │   - Cache       │
│  - Knowledge    │   │   - Rate limits │
└─────────────────┘   └─────────────────┘
```

## Key Takeaways

1. **Frontend** handles UI, **Backend** handles logic and data
2. **Routers** receive requests, **Services** do the work
3. **Postgres** for permanent data, **Redis** for temporary/fast data
4. **Magic links** for auth (no passwords)
5. Everything communicates via HTTP/JSON

When you need to add a feature, follow this existing structure. Don't reinvent the wheel.

## Going Deeper

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Postgres Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/docs/)

Next: Read `adding-to-existing-code.md` to learn how to work within this structure.
