# Phase 2: Core Chatbot - Frontend Guide

## What to Build

Create a chat interface component that allows users to send messages and receive AI responses.

## Component Structure

Build a chat component with these key elements:

1. **Message Display Area**: Shows conversation history
2. **Input Field**: Where users type messages
3. **Send Button**: Triggers message submission
4. **Toggle Button**: Opens/closes the chat interface

## State to Manage

### Required State

```javascript
const [messages, setMessages] = useState([]);
const [isOpen, setIsOpen] = useState(false);
const [isLoading, setIsLoading] = useState(false);
const [inputValue, setInputValue] = useState("");
```

### Message Format

Store messages as objects:

```javascript
{
  role: "user" | "assistant",
  content: "message text",
  timestamp: Date
}
```

## API Call Pattern

Follow existing fetch patterns in your codebase. Look for how other components make POST requests.

### Basic Pattern

```javascript
const sendMessage = async (message) => {
  setIsLoading(true);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    // Add response to messages
  } catch (error) {
    // Handle error
  } finally {
    setIsLoading(false);
  }
};
```

### Update Messages

After receiving response:

1. Add user message to array
2. Add assistant response to array
3. Clear input field
4. Scroll to bottom

## UX Considerations

### Loading Indicator

Show loading state while waiting for response:
- Disable input and send button
- Show typing indicator or spinner
- Display "Assistant is typing..." message

### Auto-Scroll

When new messages arrive, scroll to bottom:

```javascript
useEffect(() => {
  // Scroll to bottom of messages container
}, [messages]);
```

Use a ref to access the scrollable container.

### Message Persistence

Decide if messages should persist:
- **Session only**: State clears on refresh (simpler)
- **localStorage**: Messages persist across sessions
- **Backend storage**: Full conversation history

For Phase 2, session-only is sufficient.

### Input Handling

- Clear input after sending
- Disable send button when input is empty
- Support Enter key to send (with Shift+Enter for new line)
- Show character/token limits if needed

### Error States

Handle errors gracefully:
- Network failures
- API errors
- Timeout issues

Show user-friendly error messages in the chat.

## Mounting Options

Choose where to place the chat interface:

### Option 1: Floating Button (Recommended)

- Fixed position button in bottom-right corner
- Chat window slides up when opened
- Overlays existing content
- Non-intrusive

### Option 2: Sidebar

- Chat panel slides in from side
- Takes up portion of screen
- More space for conversation
- Better for extended use

### Option 3: Inline

- Embedded in specific pages
- Always visible
- Good for dedicated chat pages
- Less flexible

For Phase 2, floating button is recommended for quick access from anywhere.

## Component Layout Example

```
+---------------------------+
| Chat with Arnett Bot      |
+---------------------------+
| [User] Message 1          |
| [Bot] Response 1          |
| [User] Message 2          |
| [Bot] Response 2          |
|                           |
| ...                       |
+---------------------------+
| [Input field...........] |
| [Send]                    |
+---------------------------+
```

## Styling Considerations

- Distinguish user vs assistant messages (color, alignment)
- Make scrollable with fixed height
- Responsive design for mobile
- Accessible (keyboard navigation, screen readers)

## Integration Points

### Where to Add Toggle Button

Options:
- Navigation bar (top-right)
- Fixed position overlay (bottom-right)
- Sidebar menu item

### Component Registration

Import and include chat component in:
- Main layout component
- App.tsx/jsx
- Routes configuration

Follow your existing component structure patterns.

## Testing

Manual testing checklist:
- Open/close chat interface
- Send a message and receive response
- Send multiple messages
- Test with long messages
- Test error scenarios (backend down)
- Check mobile responsiveness
- Verify scrolling behavior

## Accessibility

- Use semantic HTML (button, input, etc.)
- Add ARIA labels for screen readers
- Ensure keyboard navigation works
- Maintain focus management

## Performance

- Don't re-render entire message list on each update
- Use React.memo or useMemo for message items
- Limit message history (e.g., last 50 messages)
- Lazy load older messages if needed

## Reference Existing Patterns

Look at your codebase for:
- How other components manage state
- API call patterns and error handling
- Modal/overlay implementations
- Form input handling
- Styling conventions

Match existing patterns for consistency.
