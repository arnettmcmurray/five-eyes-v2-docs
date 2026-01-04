# Adding the Chat Endpoint

## What you're building
A POST endpoint that receives a user message and returns an AI-generated response.

## Endpoint signature
- Route: POST /api/chat
- Input: { message: string, page_context?: string }
- Output: { response: string, timestamp: datetime }

## Dependencies needed
- openai (add to requirements.txt)
- Depends(get_current_user) - already exists in codebase

## Key OpenAI functions
- client.chat.completions.create() - the main call
- messages array with roles: "system", "user", "assistant"
- model="gpt-4o-mini" - cost effective

## Best practices
- Load knowledge base once at startup, not every request
- Keep conversation history per-user
- Set reasonable max_tokens (500-1000)
- Handle API errors gracefully
