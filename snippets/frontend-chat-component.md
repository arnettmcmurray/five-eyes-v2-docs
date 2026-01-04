# Adding the Chat Component

## What you're building
A toggleable chat panel where users ask questions during training.

## State to manage
- messages[] - conversation history
- isOpen - panel visibility
- isLoading - waiting for response

## API call pattern
- POST to /api/chat with message body
- Use existing fetch patterns from codebase

## UX considerations
- Show loading indicator while waiting
- Auto-scroll to newest message
- Persist chat across page navigation
- Clear way to minimize/close

## Where to mount
- Option A: Floating button (bottom right)
- Option B: Sidebar toggle
- Option C: Inline on training pages only
