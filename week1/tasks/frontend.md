# Frontend Tasks - Week 1

**Team:** Gabriel Costa & Michael Rogers  
**Goal:** Design the AI chat widget (no code yet)

---

## Your Mission

Design what the AI chat assistant will look like and how it works.

**By Friday, create:**

1. Visual mockup/wireframe
2. Component structure diagram
3. TypeScript type definitions
4. Mock conversation data

---

## Tasks

### 1. Explore v1 Frontend (Tuesday/Wednesday)

**What to do:**

- Clone the v1 frontend repo
- Browse the React components
- Understand routing and state management
- Note where AI widget should appear (homepage, modules, questions)

**Deliverable:** 5-bullet summary of v1 structure (post in Slack)

---

### 2. Design Chat Widget Wireframe (Wednesday/Thursday)

**What to do:**

- Sketch the chat interface (Figma, Excalidraw, or paper)
- Show:
  - Where it appears on screen (floating? sidebar?)
  - How users open/close it
  - What the conversation looks like
  - Mobile vs desktop

**Deliverable:** Wireframe image/link

**Questions to answer:**

- Does chat persist across pages?
- Can users minimize it?
- Where does it position itself?

---

### 3. Define Component Architecture (Thursday)

**What to do:**

- Break down the chat widget into React components
- Create a simple diagram showing component tree

**Example:**

```
<AIGuide>
  ├── <AIHeader>
  ├── <ChatMessages>
  │   └── <ChatMessage> (repeated)
  └── <ChatInput>
```

**Deliverable:** Component diagram (draw.io, Excalidraw, or ASCII art)

---

### 4. Write TypeScript Interfaces (Thursday)

**What to do:**

- Define types for messages, sessions, context
- Coordinate with backend team on API shape

**Example:**

```typescript
interface AIMessage {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface AIContext {
  location: "home" | "module" | "question";
  moduleId?: number;
}
```

**Deliverable:** `.ts` file with interfaces

---

### 5. Create Mock Data (Thursday/Friday)

**What to do:**

- Write 5-10 example conversations
- Show different scenarios:
  - User asks about phishing
  - User tries to get quiz answer (AI refuses)
  - User asks follow-up questions

**Deliverable:** JSON file with mock chats

---

## Acceptance Criteria

Your work is done when:

- ✅ Someone could build the component from your wireframe
- ✅ Component structure is clear
- ✅ TypeScript types are defined
- ✅ Mock data shows realistic conversations

---

## Resources

- v1 Frontend Repo: [link will be shared Tuesday]
- Figma/Excalidraw: For wireframes
- draw.io: For diagrams

---

## Questions?

- **Technical:** Ask in team channel
- **Blocked:** DM Arnett or Michael
- **Backend coordination:** Sync with Jonah/Jarred on API shape

---

**Remember:** You're designing, not coding. Focus on clarity.
