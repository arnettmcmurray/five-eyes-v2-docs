# Adding to Existing Code

You've inherited a working codebase. This guide shows you how to work within it without breaking things or fighting the existing patterns.

## The Golden Rule

**Don't reinvent patterns. Find them and follow them.**

The worst thing you can do is add code that looks completely different from everything else. It creates confusion and maintenance headaches.

## How to Read Someone Else's Codebase

You don't need to understand every line. You need to understand the patterns.

### Step 1: Find Examples

Want to add a new API endpoint? Find an existing one and see how it's done.

**Don't:**
- Read every file top to bottom
- Try to memorize the entire codebase
- Guess how things work

**Do:**
- Find a similar feature
- See what files it touches
- Copy the pattern

### Step 2: Look for Patterns, Not Details

Example: You need to add a new endpoint for uploading knowledge base files.

**Look at existing endpoints:**

```python
# routers/chat.py
@router.post("/chat/send")
async def send_message(
    message: ChatMessageRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = await chat_service.process_message(
        db=db,
        user_id=current_user.id,
        message=message.content
    )
    return result
```

**Patterns you notice:**
- Route decorator: `@router.post("/path")`
- Type hints for request body: `message: ChatMessageRequest`
- Dependency injection: `Depends(get_current_user)`, `Depends(get_db)`
- Services do the work: `chat_service.process_message(...)`
- Returns a result directly (FastAPI handles JSON conversion)

**Your new endpoint should follow this:**

```python
# routers/knowledge.py
@router.post("/knowledge/upload")
async def upload_file(
    file: UploadFileRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = await knowledge_service.upload_file(
        db=db,
        user_id=current_user.id,
        file_content=file.content
    )
    return result
```

Same pattern, different purpose.

### Step 3: Trace the Data Flow

Pick one feature and follow it through the entire stack:

```
1. Frontend button click (components/ChatInput.jsx)
   ↓
2. Event handler calls API function (api/chat.js)
   ↓
3. API function makes fetch request
   ↓
4. Backend router receives request (routers/chat.py)
   ↓
5. Router calls service (services/chat_service.py)
   ↓
6. Service queries database and calls OpenAI
   ↓
7. Service returns result
   ↓
8. Router returns JSON
   ↓
9. Frontend updates state and UI
```

Once you've traced one feature, you understand how to add another.

## Finding Patterns to Follow

### Backend Patterns

**Adding a new endpoint:**

1. Look at `routers/` - find similar endpoint
2. Look at `services/` - see how logic is organized
3. Look at `models/` - see how data is structured

**Example task:** Add endpoint to delete a chat conversation

```bash
# Find existing delete operations
grep -r "delete" backend/app/routers/
# Look at how they're implemented
```

You'll find patterns like:

```python
@router.delete("/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    await conversation_service.delete(db, conversation_id, current_user.id)
    return {"status": "deleted"}
```

Copy this structure for your new deletion endpoint.

### Frontend Patterns

**Adding a new component:**

1. Look at `components/` - find similar UI element
2. See how it uses props, state, and events
3. Check how it's styled

**Example task:** Add a "Clear Chat" button

Find existing buttons:

```jsx
// components/SendButton.jsx
export function SendButton({ onClick, disabled }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="btn-primary"
        >
            Send
        </button>
    );
}
```

Your button follows the same pattern:

```jsx
// components/ClearButton.jsx
export function ClearButton({ onClick, disabled }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="btn-secondary"
        >
            Clear Chat
        </button>
    );
}
```

**Adding a new page:**

Look at existing pages in `pages/`:

```jsx
// pages/Chat.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MessageList } from '../components/MessageList';

export function Chat() {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        loadMessages();
    }, []);

    // Component logic

    return (
        <div className="page-container">
            <MessageList messages={messages} />
        </div>
    );
}
```

Pattern:
- Import hooks and components
- Use `useAuth()` for user info
- Use `useState()` for data
- Use `useEffect()` to load data on mount
- Return JSX with semantic class names

Follow this for any new page.

## Where to Inject New Functionality

### Backend: Follow the Layer Pattern

```
Routers → Services → Database
```

**Router layer:**
- Only handles HTTP stuff (request/response)
- Validates input
- Calls services
- Returns results

**Service layer:**
- Business logic lives here
- Database queries
- External API calls (OpenAI, email, etc.)

**Database layer:**
- Model definitions
- Query helpers

**Example:** Add a feature to summarize long conversations

**Router (routers/chat.py):**

```python
@router.post("/conversations/{conversation_id}/summarize")
async def summarize_conversation(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    summary = await chat_service.summarize_conversation(
        db=db,
        conversation_id=conversation_id,
        user_id=current_user.id
    )
    return {"summary": summary}
```

**Service (services/chat_service.py):**

```python
async def summarize_conversation(
    db: Session,
    conversation_id: int,
    user_id: int
) -> str:
    # Get messages from database
    messages = db.query(Message).filter(
        Message.conversation_id == conversation_id,
        Message.user_id == user_id
    ).all()

    # Format for OpenAI
    conversation_text = "\n".join([m.content for m in messages])

    # Call OpenAI to summarize
    response = await openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "Summarize this conversation."},
            {"role": "user", "content": conversation_text}
        ]
    )

    return response.choices[0].message.content
```

Notice:
- Router is thin (just routing)
- Service has all the logic
- Follows existing patterns

### Frontend: Component Hierarchy

```
Pages → Components → Hooks
```

**Pages:**
- Top-level routes
- Compose components
- Manage page-level state

**Components:**
- Reusable UI pieces
- Receive props, emit events
- Can have local state

**Hooks:**
- Reusable logic
- Data fetching
- Auth, etc.

**Example:** Add a "Summarize" button to chat page

**Component (components/SummarizeButton.jsx):**

```jsx
export function SummarizeButton({ conversationId, onSummary }) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        const response = await fetch(
            `http://localhost:8000/api/conversations/${conversationId}/summarize`,
            { method: "POST" }
        );
        const data = await response.json();
        onSummary(data.summary);
        setLoading(false);
    };

    return (
        <button onClick={handleClick} disabled={loading}>
            {loading ? "Summarizing..." : "Summarize"}
        </button>
    );
}
```

**Page (pages/Chat.jsx):**

```jsx
export function Chat() {
    const [summary, setSummary] = useState(null);

    return (
        <div>
            <MessageList messages={messages} />
            <SummarizeButton
                conversationId={conversationId}
                onSummary={setSummary}
            />
            {summary && <div className="summary">{summary}</div>}
        </div>
    );
}
```

Pattern:
- Button component handles its own loading state
- Page handles the summary data
- Clean separation of concerns

## Following Existing Conventions

### Naming Conventions

**Backend:**
- Files: `snake_case.py`
- Classes: `PascalCase`
- Functions: `snake_case()`
- Constants: `UPPER_SNAKE_CASE`

```python
# Good - matches existing style
class ChatService:
    async def process_message(self, message: str) -> str:
        pass

# Bad - doesn't match
class chatService:
    async def ProcessMessage(self, message: str) -> str:
        pass
```

**Frontend:**
- Files: `PascalCase.jsx` for components, `camelCase.js` for utilities
- Components: `PascalCase`
- Functions: `camelCase()`
- Constants: `UPPER_SNAKE_CASE`

```jsx
// Good
export function ChatMessage({ content }) {
    const formattedContent = formatMessage(content);
    return <div>{formattedContent}</div>;
}

// Bad
export function chat_message({ content }) {
    const FormattedContent = format_message(content);
    return <div>{FormattedContent}</div>;
}
```

### File Organization

**Backend:**

```
backend/app/
├── routers/          # API endpoints
│   ├── auth.py
│   ├── chat.py
│   └── knowledge.py
├── services/         # Business logic
│   ├── auth_service.py
│   ├── chat_service.py
│   └── knowledge_service.py
├── models/           # Data models
│   ├── user.py
│   ├── message.py
│   └── conversation.py
└── utils/            # Helpers
    └── validators.py
```

New feature? Create files in the same pattern.

**Frontend:**

```
frontend/src/
├── pages/            # Route components
│   ├── Chat.jsx
│   └── Admin.jsx
├── components/       # Reusable components
│   ├── MessageBubble.jsx
│   └── ChatInput.jsx
├── hooks/            # Custom hooks
│   └── useAuth.jsx
├── api/              # API client functions
│   └── chat.js
└── utils/            # Helper functions
    └── formatters.js
```

### Error Handling

Look at how existing code handles errors:

```python
# Existing pattern
@router.post("/chat/send")
async def send_message(...):
    try:
        result = await chat_service.process_message(...)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error processing message: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
```

Follow this pattern:
- Catch specific exceptions first
- Return appropriate HTTP status codes
- Log unexpected errors
- Don't expose internal details to users

## The Dashboard's Specific Patterns

### Backend Patterns

**Dependency Injection:**

```python
# Current user from auth
current_user: User = Depends(get_current_user)

# Database session
db: Session = Depends(get_db)
```

Always use these in protected endpoints.

**Service Pattern:**

```python
# Router calls service
result = await service.method(db=db, user_id=user.id, ...)
```

Don't put business logic in routers.

**Response Models:**

```python
class ChatResponse(BaseModel):
    message_id: int
    content: str
    timestamp: datetime

@router.post("/chat/send", response_model=ChatResponse)
async def send_message(...):
    return ChatResponse(...)
```

Use Pydantic models for responses.

### Frontend Patterns

**API Calls:**

```jsx
// Centralized in api/ folder
export async function sendMessage(message) {
    const response = await fetch("http://localhost:8000/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    });
    return response.json();
}

// Used in components
import { sendMessage } from '../api/chat';
const result = await sendMessage(text);
```

Don't inline fetch calls in components.

**State Management:**

```jsx
// Local state for UI
const [loading, setLoading] = useState(false);

// Shared state via Context (if auth is in context)
const { user, login, logout } = useAuth();
```

Simple state with `useState`, shared state with Context.

**Styling:**

```jsx
// If using CSS modules
import styles from './Chat.module.css';
<div className={styles.container}>

// If using plain CSS
<div className="chat-container">
```

Match whatever the codebase uses.

## Debugging Tips

### Backend Debugging

**Add logging:**

```python
import logging
logger = logging.getLogger(__name__)

logger.info(f"Processing message for user {user_id}")
logger.debug(f"Message content: {message}")
logger.error(f"Failed to process: {e}")
```

**Check Docker logs:**

```bash
docker compose logs -f backend
```

**Use FastAPI's automatic docs:**

Visit `http://localhost:8000/docs` to test endpoints interactively.

### Frontend Debugging

**Console.log strategically:**

```jsx
const handleClick = async () => {
    console.log("Button clicked");
    const result = await sendMessage(text);
    console.log("Result:", result);
};
```

**React DevTools:**

Install the browser extension to inspect component state and props.

**Network tab:**

Check browser DevTools Network tab to see API requests/responses.

## Common Mistakes to Avoid

### 1. Breaking Existing Patterns

**Bad:**

```python
# Everyone uses async, you use sync
@router.post("/new-endpoint")
def my_endpoint():  # Should be async
    return do_something()
```

**Good:**

```python
@router.post("/new-endpoint")
async def my_endpoint():  # Match existing async pattern
    return await do_something()
```

### 2. Ignoring Existing Utilities

**Bad:**

```python
# Write your own validation
if not email or "@" not in email:
    raise HTTPException(400, "Invalid email")
```

**Good:**

```python
# Use existing validator (if it exists)
from app.utils.validators import validate_email
validate_email(email)
```

### 3. Hardcoding Values

**Bad:**

```python
openai.api_key = "sk-abc123..."  # Hardcoded
```

**Good:**

```python
from app.config import settings
openai.api_key = settings.OPENAI_API_KEY  # From environment
```

### 4. Not Testing Your Changes

Before you commit:

1. **Test the happy path** - Does it work as expected?
2. **Test edge cases** - What if input is empty? Invalid?
3. **Test existing features** - Did you break anything?

## Quick Checklist for Adding Features

- [ ] Found similar existing code?
- [ ] Following the same file structure?
- [ ] Using the same naming conventions?
- [ ] Following the same patterns (async, dependencies, etc.)?
- [ ] Handling errors like existing code?
- [ ] Tested your changes?
- [ ] No hardcoded values?
- [ ] Logged important actions?

## When in Doubt

1. **Search the codebase** - `grep -r "pattern"` is your friend
2. **Look at git history** - `git log` shows how others added features
3. **Ask your team** - Someone else might have already done something similar
4. **Check the docs** - Framework docs (FastAPI, React) are gold

## Going Deeper

Now that you understand how to work within this codebase:

- Read the framework docs for deeper understanding
- Explore the codebase systematically (one feature at a time)
- Keep a local notes file with patterns you discover

Remember: The goal isn't to memorize every file. It's to recognize and follow patterns. Code that looks like everything else is code that's easy to maintain.
