# Phase 2: Core Chatbot - Architecture

## Request/Response Flow

```
User Types Message
       |
       v
React Chat Component
       |
       v
POST /api/chat
       |
       v
FastAPI Router
       |
       +---> Load Knowledge Base (from dashboard files)
       |
       +---> Build Messages Array (system + user message)
       |
       v
OpenAI API (chat.completions.create)
       |
       v
AI Response
       |
       v
FastAPI Router (return JSON)
       |
       v
React Component (display message)
       |
       v
User Sees Response
```

## Layer Responsibilities

### Frontend (React)
- Capture user input
- Display conversation history
- Show loading states
- Handle UI interactions (open/close, scroll)

### Backend (FastAPI)
- Accept POST request with user message
- Load and format knowledge base content
- Construct OpenAI messages array with system prompt
- Call OpenAI API
- Return AI response as JSON

### OpenAI API
- Process user message with context
- Generate response based on knowledge base
- Return completion

## Knowledge Base Integration

The knowledge base is loaded from dashboard files and injected into the system prompt:

```
System Message: "You are an assistant. Here is the knowledge base: [content]"
User Message: "What is the project about?"
```

This gives the AI context to answer questions accurately based on your documentation.

## Data Flow

1. User sends message: `{ message: "string" }`
2. Backend builds context from files
3. OpenAI receives: `[{ role: "system", content: "..." }, { role: "user", content: "..." }]`
4. OpenAI returns completion
5. Frontend receives: `{ response: "string" }`
6. UI updates with new message
