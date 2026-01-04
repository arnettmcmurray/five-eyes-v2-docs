# Phase 2: Core Chatbot - Backend Guide

## What to Build

Create a new API endpoint that accepts user messages and returns AI-generated responses.

### Endpoint Signature

```
POST /api/chat
Content-Type: application/json

Request Body:
{
  "message": "string"
}

Response:
{
  "response": "string"
}
```

## Key Dependencies

Install the OpenAI package:

```bash
pip install openai
```

Add to requirements.txt if using one.

## OpenAI Functions to Know

### 1. Client Initialization

```python
from openai import OpenAI
client = OpenAI(api_key="your-api-key")
```

Store API key in environment variables, not in code.

### 2. Chat Completions

```python
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[...],
    max_tokens=500
)
```

### 3. Messages Array Structure

```python
messages = [
    {"role": "system", "content": "You are a helpful assistant. Knowledge: ..."},
    {"role": "user", "content": "User's question here"}
]
```

Roles:
- `system`: Sets behavior and provides context (knowledge base)
- `user`: The actual user message
- `assistant`: Previous AI responses (for conversation history)

## Implementation Steps

### 1. Create Router

Follow the pattern of existing routers in your codebase. Create a new file like `routers/chat.py`.

### 2. Load Knowledge Base

Read dashboard files at startup or on first request:

```python
def load_knowledge_base():
    # Read files from dashboard directory
    # Combine into single string
    # Return formatted content
```

Best practice: Load once and cache, don't read files on every request.

### 3. Build System Prompt

Inject knowledge base into system message:

```python
system_message = f"You are an assistant for the Arnett project. Use this knowledge base to answer questions: {knowledge_base_content}"
```

### 4. Handle Request

```python
@router.post("/chat")
async def chat(request: ChatRequest):
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": request.message}
    ]

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=messages,
        max_tokens=500
    )

    return {"response": response.choices[0].message.content}
```

### 5. Register Router in main.py

Add your new router to the main application:

```python
from routers import chat
app.include_router(chat.router, prefix="/api")
```

## Best Practices

### Error Handling

Wrap OpenAI calls in try/except:

```python
try:
    response = client.chat.completions.create(...)
except Exception as e:
    return {"error": "Failed to get response"}
```

### Token Limits

Set `max_tokens` to prevent excessive usage:
- 500 tokens for concise responses
- 1000 tokens for detailed explanations

### API Key Security

Never commit API keys. Use environment variables:

```python
import os
api_key = os.getenv("OPENAI_API_KEY")
```

### Knowledge Base Format

Keep knowledge base concise. If files are large, summarize or chunk them.

### Response Time

OpenAI API can take 2-5 seconds. Make sure frontend shows loading state.

## Testing

Test with curl:

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is this project about?"}'
```

Expected response should reference knowledge base content.

## Reference Existing Patterns

Look at how other routers are structured in your codebase:
- How they define request/response models (Pydantic)
- How they handle errors
- How they're registered in main.py

Follow the same patterns for consistency.
