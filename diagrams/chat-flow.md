# Chat Flow Sequence Diagram

This diagram shows the complete request/response flow when a user interacts with the AI chatbot.

```
┌──────┐                ┌──────────┐              ┌─────────┐           ┌──────────┐
│ User │                │ Frontend │              │ Backend │           │ OpenAI   │
│      │                │(ChatWindow)│            │(/api/chat)│         │   API    │
└──┬───┘                └────┬─────┘              └────┬────┘           └────┬─────┘
   │                         │                         │                     │
   │ 1. Click chat icon      │                         │                     │
   ├────────────────────────>│                         │                     │
   │                         │                         │                     │
   │                         │ 2. Open ChatWindow      │                     │
   │                         │    component            │                     │
   │                         │                         │                     │
   │ 3. Type message         │                         │                     │
   │    + press send         │                         │                     │
   ├────────────────────────>│                         │                     │
   │                         │                         │                     │
   │                         │ 4. POST /api/chat       │                     │
   │                         │    {message, context}   │                     │
   │                         ├────────────────────────>│                     │
   │                         │                         │                     │
   │                         │                         │ 5. Load knowledge   │
   │                         │                         │    base (FAQ, data) │
   │                         │                         │                     │
   │                         │                         │ 6. Build prompt:    │
   │                         │                         │    - System instructions│
   │                         │                         │    - Knowledge base │
   │                         │                         │    - Conversation history│
   │                         │                         │    - User message   │
   │                         │                         │                     │
   │                         │                         │ 7. Call OpenAI API  │
   │                         │                         ├────────────────────>│
   │                         │                         │                     │
   │                         │                         │                     │ 8. Process
   │                         │                         │                     │    with GPT
   │                         │                         │                     │
   │                         │                         │ 9. Return response  │
   │                         │                         │<────────────────────┤
   │                         │                         │                     │
   │                         │                         │ 10. Save to         │
   │                         │                         │     conversation    │
   │                         │                         │     history         │
   │                         │                         │                     │
   │                         │ 11. Return response     │                     │
   │                         │     {reply, timestamp}  │                     │
   │                         │<────────────────────────┤                     │
   │                         │                         │                     │
   │                         │ 12. Display in          │                     │
   │                         │     ChatWindow          │                     │
   │                         │                         │                     │
   │ 13. See response        │                         │                     │
   │<────────────────────────┤                         │                     │
   │                         │                         │                     │
```

## Key Components

### Frontend (ChatWindow Component)
- Handles user input
- Sends HTTP POST requests to backend
- Receives and displays responses
- Manages UI state (loading, errors)

### Backend (/api/chat endpoint)
- Receives chat requests
- Loads knowledge base from data files
- Constructs OpenAI prompt with context
- Calls OpenAI API
- Stores conversation history
- Returns formatted response

### OpenAI API
- Processes prompt with GPT model
- Returns AI-generated response
- Context-aware based on provided knowledge

## Data Flow

### Request Payload
```json
{
  "message": "How do I set up MFA?",
  "context": {
    "current_page": "access-management",
    "user_progress": {...},
    "conversation_id": "abc123"
  }
}
```

### Response Payload
```json
{
  "reply": "To set up MFA, navigate to...",
  "timestamp": "2024-01-15T10:30:00Z",
  "conversation_id": "abc123"
}
```

## Error Handling

```
User sends message
    ↓
Frontend validates input
    ↓
Backend receives request
    ↓
[ERROR: OpenAI API unavailable]
    ↓
Backend returns fallback response
    ↓
Frontend displays: "Sorry, the chatbot is temporarily unavailable"
```
