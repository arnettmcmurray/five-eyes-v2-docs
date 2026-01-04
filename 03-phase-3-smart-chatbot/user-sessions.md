# User Sessions

## Overview
Tie chatbot conversations to authenticated user sessions so each user has their own persistent chat history and personalized experience.

## Why User Sessions Matter

Without user sessions:
- Chat history is shared across all users or lost on refresh
- No personalization based on user role or progress
- Can't retrieve conversation history across devices
- Privacy concerns if multiple users share a device

With user sessions:
- Each user has their own isolated chat history
- Personalized responses based on user profile
- History persists across page reloads and devices
- Secure and privacy-compliant

## Leveraging Existing Dashboard Auth

Your training dashboard likely already has authentication. Use that same system for the chatbot.

### Typical Flow

1. User logs into dashboard (existing auth)
2. User opens chatbot
3. Chatbot retrieves user ID from session/token
4. Chat messages are stored with user ID
5. On page reload, chatbot loads that user's history

## Implementation Patterns

### Pattern 1: Backend API with Session

**Client side:**
```javascript
// Chatbot component
function Chatbot() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Load user's chat history on mount
    loadChatHistory();
  }, []);

  async function loadChatHistory() {
    // Auth token/session is already attached by your auth system
    const response = await fetch('/api/chat/history');
    const history = await response.json();
    setMessages(history);
  }

  async function sendMessage(userInput) {
    const response = await fetch('/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput })
    });

    const data = await response.json();
    setMessages([...messages,
      { role: 'user', content: userInput },
      { role: 'assistant', content: data.response }
    ]);
  }
}
```

**Server side:**
```javascript
// /api/chat/send
app.post('/api/chat/send', authenticateUser, async (req, res) => {
  const userId = req.user.id; // From your existing auth middleware
  const userInput = req.body.message;

  // Load user's conversation history
  const history = await db.query(
    'SELECT role, content FROM chat_messages WHERE user_id = $1 ORDER BY created_at',
    [userId]
  );

  // Send to OpenAI with history
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a training assistant.' },
      ...history.rows,
      { role: 'user', content: userInput }
    ]
  });

  const assistantMessage = response.choices[0].message.content;

  // Save both messages to database
  await db.query(
    'INSERT INTO chat_messages (user_id, role, content) VALUES ($1, $2, $3)',
    [userId, 'user', userInput]
  );
  await db.query(
    'INSERT INTO chat_messages (user_id, role, content) VALUES ($1, $2, $3)',
    [userId, 'assistant', assistantMessage]
  );

  res.json({ response: assistantMessage });
});

// /api/chat/history
app.get('/api/chat/history', authenticateUser, async (req, res) => {
  const userId = req.user.id;

  const history = await db.query(
    'SELECT role, content FROM chat_messages WHERE user_id = $1 ORDER BY created_at',
    [userId]
  );

  res.json(history.rows);
});
```

### Pattern 2: JWT/Token-Based Auth

If your dashboard uses JWT tokens:

```javascript
// Client includes JWT in requests
async function sendMessage(userInput) {
  const token = localStorage.getItem('authToken'); // Or wherever you store it

  const response = await fetch('/api/chat/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message: userInput })
  });
}

// Server validates JWT and extracts user ID
app.post('/api/chat/send', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, SECRET_KEY);
  const userId = decoded.userId;

  // Rest of implementation...
});
```

### Pattern 3: Next.js with Session

If using Next.js with `next-auth` or similar:

```javascript
// pages/api/chat/send.js
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const userId = session.user.id;
  const userInput = req.body.message;

  // Load history, call OpenAI, save messages...
}
```

## Database Schema

Store messages with user association:

```sql
CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  role VARCHAR(20) NOT NULL, -- 'user', 'assistant', 'system'
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),

  INDEX idx_user_created (user_id, created_at)
);
```

Optional: Organize into conversations:

```sql
CREATE TABLE chat_conversations (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  started_at TIMESTAMP DEFAULT NOW(),
  last_message_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  conversation_id INT NOT NULL REFERENCES chat_conversations(id),
  role VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

This allows users to have multiple separate conversations.

## Personalization Based on User Data

Once you have the user ID, you can personalize responses:

```javascript
app.post('/api/chat/send', authenticateUser, async (req, res) => {
  const userId = req.user.id;

  // Fetch user profile
  const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
  const profile = user.rows[0];

  // Fetch user progress
  const progress = await db.query(
    'SELECT * FROM user_progress WHERE user_id = $1',
    [userId]
  );

  // Build personalized system prompt
  const systemPrompt = `You are a training assistant for Arnett Inc.

User profile:
- Name: ${profile.name}
- Role: ${profile.role}
- Department: ${profile.department}
- Training progress: ${progress.completion_percent}% complete
- Current module: ${progress.current_module}

Provide personalized help based on this user's role and progress.`;

  // Continue with OpenAI call...
});
```

## Handling Multiple Devices

With server-stored history, users can access their chat from any device:

1. User starts conversation on desktop
2. Logs in on mobile
3. Opens chatbot - sees same conversation history
4. Continues conversation seamlessly

No additional work needed if history is stored server-side tied to user ID.

## Privacy and Security

### Best Practices

**1. Isolate user data:**
```sql
-- Always filter by user_id
SELECT * FROM chat_messages WHERE user_id = $1;
```

**2. Don't expose other users' data:**
```javascript
// BAD: Uses user-supplied ID
const history = await getHistory(req.body.userId);

// GOOD: Uses authenticated user's ID
const history = await getHistory(req.user.id);
```

**3. Sanitize inputs:**
```javascript
const userInput = sanitize(req.body.message);
```

**4. Rate limiting:**
```javascript
// Limit messages per user per hour
const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // 100 requests per hour
  keyGenerator: (req) => req.user.id
});

app.post('/api/chat/send', authenticateUser, rateLimiter, async (req, res) => {
  // ...
});
```

**5. Consider GDPR/Privacy:**
- Allow users to delete their chat history
- Don't log sensitive information
- Add privacy notice about AI chat

## Clearing/Resetting Chat History

Give users control over their data:

```javascript
// API endpoint to clear history
app.delete('/api/chat/history', authenticateUser, async (req, res) => {
  const userId = req.user.id;

  await db.query('DELETE FROM chat_messages WHERE user_id = $1', [userId]);

  res.json({ success: true });
});

// UI button
<button onClick={clearHistory}>Clear Chat History</button>
```

## Testing User Sessions

1. Log in as User A, send messages
2. Log out, log in as User B, send different messages
3. Log back in as User A - verify you see User A's messages, not User B's
4. Reload page - verify history persists
5. Try on different device/browser - verify history follows user

## Example: Complete Integration

```javascript
// Client
function Chatbot() {
  const { user } = useAuth(); // Your existing auth hook
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  async function loadHistory() {
    const res = await fetch('/api/chat/history');
    const history = await res.json();
    setMessages(history);
  }

  async function sendMessage(text) {
    const res = await fetch('/api/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();

    setMessages([
      ...messages,
      { role: 'user', content: text },
      { role: 'assistant', content: data.response }
    ]);
  }

  if (!user) {
    return <p>Please log in to use the chatbot.</p>;
  }

  return <ChatInterface messages={messages} onSend={sendMessage} />;
}

// Server
app.post('/api/chat/send', authenticateUser, async (req, res) => {
  const userId = req.user.id;
  const userInput = req.body.message;

  // Get history
  const historyResult = await db.query(
    'SELECT role, content FROM chat_messages WHERE user_id = $1 ORDER BY created_at',
    [userId]
  );

  // Call OpenAI
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a training assistant.' },
      ...historyResult.rows,
      { role: 'user', content: userInput }
    ]
  });

  const botResponse = completion.choices[0].message.content;

  // Save messages
  await db.query(
    'INSERT INTO chat_messages (user_id, role, content) VALUES ($1, $2, $3), ($1, $4, $5)',
    [userId, 'user', userInput, 'assistant', botResponse]
  );

  res.json({ response: botResponse });
});
```

## Next Steps
Combine user sessions with conversation memory and context awareness to create a fully personalized, context-aware chatbot experience.
