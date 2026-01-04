# Conversation Memory

## Overview
Phase 3 adds conversation memory so the chatbot maintains context across multiple messages. Without this, every message is treated as the start of a new conversation.

## Why Memory Matters
- Users can ask follow-up questions without repeating context
- Chatbot can reference previous answers
- Conversations feel natural and coherent
- "What about the third option?" works because it remembers what options were discussed

## Storage Options

### Option 1: Client-Side State (Simplest)
Store messages in React state or context. Works for single-session use.

```javascript
const [messages, setMessages] = useState([]);

// Add new message
setMessages([...messages, { role: 'user', content: userInput }]);
setMessages([...messages, { role: 'assistant', content: botResponse }]);
```

**Pros:** Simple, no backend changes needed
**Cons:** Lost on page reload, not persisted across sessions

### Option 2: Database (Persistent)
Store conversation history in PostgreSQL or similar.

```sql
CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  role VARCHAR(20),
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Pros:** Survives reloads, tied to user, queryable
**Cons:** More complex, database writes for every message

### Option 3: Redis/Session Store (Middle Ground)
Store in Redis or server-side session with TTL.

**Pros:** Fast, persists across page loads, auto-expires old conversations
**Cons:** Requires Redis or session infrastructure

## Sending History to OpenAI

OpenAI's Chat API expects an array of message objects:

```javascript
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    { role: "system", content: "You are a helpful training assistant." },
    { role: "user", content: "What is Module 1 about?" },
    { role: "assistant", content: "Module 1 covers workplace safety..." },
    { role: "user", content: "How long does it take?" }
  ]
});
```

Each request includes the full conversation history so the model has context.

## Token Limits and Truncation

Models have token limits (e.g., 8K, 16K, 128K). Long conversations can exceed this.

### Truncation Strategies

**1. Keep Last N Messages**
```javascript
const maxMessages = 20;
const recentMessages = messages.slice(-maxMessages);
```

**2. Sliding Window**
Always keep system message, drop oldest user/assistant pairs:
```javascript
const systemMsg = messages[0];
const recentHistory = messages.slice(-19); // Keep last 19 + system = 20 total
const truncated = [systemMsg, ...recentHistory];
```

**3. Token Counting**
Use `tiktoken` or similar to count tokens and truncate precisely:
```javascript
import { encoding_for_model } from 'tiktoken';

const enc = encoding_for_model('gpt-4');
let totalTokens = 0;
const truncated = [];

for (let i = messages.length - 1; i >= 0; i--) {
  const tokens = enc.encode(messages[i].content).length;
  if (totalTokens + tokens > 4000) break;
  truncated.unshift(messages[i]);
  totalTokens += tokens;
}
```

## Implementation Example

```javascript
async function sendMessage(userInput, conversationHistory) {
  // Truncate if needed
  const recentHistory = conversationHistory.slice(-20);

  // Build messages array
  const messages = [
    { role: "system", content: "You are a training assistant." },
    ...recentHistory,
    { role: "user", content: userInput }
  ];

  // Call OpenAI
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: messages
  });

  const assistantMessage = response.choices[0].message.content;

  // Update history
  const updatedHistory = [
    ...recentHistory,
    { role: "user", content: userInput },
    { role: "assistant", content: assistantMessage }
  ];

  // Save to database/state
  saveHistory(updatedHistory);

  return assistantMessage;
}
```

## Best Practices

- Always include a system message to set chatbot behavior
- Store both user and assistant messages
- Truncate before hitting token limits to avoid errors
- Consider summarizing very old messages instead of dropping them
- Test with long conversations to verify truncation works
- Monitor token usage for cost optimization

## Next Steps
Once memory is working, add context awareness so the chatbot knows what page the user is on (see `context-awareness.md`).
