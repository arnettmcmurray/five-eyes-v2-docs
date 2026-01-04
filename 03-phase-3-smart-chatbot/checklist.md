# Phase 3: Smart Chatbot - Checklist

## Conversation Memory
- [ ] Conversation history persists across messages
- [ ] History sent with each request to OpenAI
- [ ] Token limits handled (truncation strategy in place)
- [ ] Chat state maintained in session or database

## Context Awareness
- [ ] Chatbot knows current page/module user is on
- [ ] Context passed in system prompt or user message
- [ ] Responses reflect user's location ("I see you're on Module 3...")
- [ ] Dynamic knowledge based on current context

## User Sessions
- [ ] Chat tied to logged-in user session
- [ ] Conversations stored per user ID
- [ ] History retrievable on page reload
- [ ] Leverages existing dashboard authentication

## Quality Checks
- [ ] Chatbot maintains coherent multi-turn conversations
- [ ] Context-aware responses are accurate
- [ ] History doesn't break when switching pages
- [ ] User-specific data is isolated and secure
