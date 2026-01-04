# Context Awareness

## Overview
Context awareness means the chatbot knows where the user is in the training platform and can provide relevant, location-specific help.

## Why Context Matters

Without context:
> "What should I do next?"
> "I'm not sure what you're referring to. Can you be more specific?"

With context:
> "What should I do next?"
> "I see you're on Module 3, Lesson 2. The next step is to complete the quiz at the bottom of this page."

Context makes the chatbot feel intelligent and aware of the user's situation.

## What Context to Capture

### Current Location
- Module ID/name
- Lesson ID/name
- Page type (lesson, quiz, dashboard, etc.)
- Section within page

### User Progress
- Completed modules/lessons
- Current quiz attempt
- Last accessed content
- Completion percentage

### User Profile
- Role (employee, manager, admin)
- Department
- Training track
- Start date

## Implementation Approaches

### Approach 1: Pass Context in System Prompt

Include context in the system message sent to OpenAI:

```javascript
const systemPrompt = `You are a helpful training assistant for Arnett Inc.

Current context:
- User: ${user.name} (${user.role})
- Location: ${currentModule} - ${currentLesson}
- Progress: ${completionPercent}% complete
- Quiz status: ${quizStatus}

Provide helpful, context-aware responses. Reference the user's current location when relevant.`;

const messages = [
  { role: "system", content: systemPrompt },
  ...conversationHistory,
  { role: "user", content: userInput }
];
```

### Approach 2: Include Context in User Message

Append context to the user's message:

```javascript
const enrichedMessage = `${userInput}

[Context: User is on ${currentModule}, ${currentLesson}. Progress: ${completionPercent}%]`;
```

### Approach 3: Separate Context Parameter

Use a dedicated context field in the API call:

```javascript
const messages = [
  { role: "system", content: "You are a training assistant." },
  {
    role: "system",
    content: `Context: ${JSON.stringify({
      module: currentModule,
      lesson: currentLesson,
      progress: userProgress
    })}`
  },
  ...conversationHistory,
  { role: "user", content: userInput }
];
```

## Capturing Context from the UI

### React Example

```javascript
// In your page component
function LessonPage({ moduleId, lessonId }) {
  const context = {
    type: 'lesson',
    moduleId: moduleId,
    moduleName: getModuleName(moduleId),
    lessonId: lessonId,
    lessonName: getLessonName(lessonId),
    nextLesson: getNextLesson(lessonId)
  };

  return (
    <div>
      <LessonContent />
      <Chatbot context={context} />
    </div>
  );
}

// In chatbot component
function Chatbot({ context }) {
  const sendMessage = async (userInput) => {
    const systemPrompt = `You are a training assistant.

Current context:
- Page type: ${context.type}
- Module: ${context.moduleName}
- Lesson: ${context.lessonName}

When answering questions, reference the user's current location if relevant.`;

    // Send to OpenAI with context
  };
}
```

### Next.js Example with URL Params

```javascript
// pages/modules/[moduleId]/lessons/[lessonId].js
export default function LessonPage() {
  const router = useRouter();
  const { moduleId, lessonId } = router.query;

  const context = {
    moduleId,
    lessonId,
    path: router.asPath
  };

  return <Chatbot context={context} />;
}
```

## Dynamic Responses Based on Context

### Example Prompts

**Generic system prompt:**
```
You are a helpful training assistant for Arnett Inc. Answer questions about the training material.
```

**Context-aware system prompt:**
```
You are a helpful training assistant for Arnett Inc.

The user is currently on: Module 3 - Workplace Safety, Lesson 2 - PPE Requirements

When answering:
- Reference this specific module/lesson when relevant
- Suggest next steps based on their current location
- If they ask about "this module" or "this lesson", you know they mean Module 3, Lesson 2
- Guide them through the content in order
```

### Example Interactions

**User:** "Is there a quiz?"
**Bot (without context):** "Most modules have quizzes. Check the module page."
**Bot (with context):** "Yes, Module 3 has a quiz at the end of Lesson 4. You're currently on Lesson 2, so you have two more lessons before the quiz."

**User:** "What's this about?"
**Bot (without context):** "What would you like to know about?"
**Bot (with context):** "This lesson covers PPE requirements - specifically when and how to use personal protective equipment in different workplace scenarios. Would you like me to explain any particular type of PPE?"

## Updating Context Dynamically

If the user navigates to a different page, update the context:

```javascript
function Chatbot() {
  const [context, setContext] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Update context when page changes
    const newContext = extractContextFromLocation(location);
    setContext(newContext);
  }, [location]);

  // Use current context in API calls
}
```

## Advanced: Context from User Actions

Track what the user is doing and add that to context:

```javascript
const context = {
  currentPage: 'Module 3, Lesson 2',
  lastAction: 'Started quiz attempt',
  quizProgress: '2/10 questions answered',
  timeOnPage: '5 minutes',
  recentActions: [
    'Viewed video',
    'Scrolled to quiz section',
    'Answered question 1 incorrectly'
  ]
};
```

This enables highly specific responses:
> "I see you got question 1 wrong. The correct answer is B because..."

## Best Practices

- Keep context concise - only include what's useful for generating responses
- Update context when user navigates to a new page
- Don't send sensitive data in context unless necessary
- Test that context actually improves responses
- Consider privacy - don't log detailed user actions without consent
- Format context clearly so the model can parse it easily

## Testing Context Awareness

Ask these questions in different locations:

- "What should I do next?"
- "Is there a quiz?"
- "What's this about?"
- "How much longer?"

Verify the bot gives location-specific answers.

## Next Steps
Combine context awareness with user sessions (see `user-sessions.md`) to provide personalized, context-aware help tied to each user's account.
