# Arnett Team Guide

A comprehensive guidance package for building a cybersecurity AI chatbot integrated with the Five Eyes Dashboard.

**Start here:** Read `00-overview.md` first, then `priority-stack.md` to understand the dependency order.

---

## Root Documents

| Document | Purpose |
|----------|---------|
| [00-overview.md](./00-overview.md) | Project goals, philosophy, and what success looks like |
| [priority-stack.md](./priority-stack.md) | What blocks what - the dependency tree for all work |
| [team-task-breakdown.md](./team-task-breakdown.md) | Who works on what - Frontend, Backend, and Integration tracks |
| [red-flags.md](./red-flags.md) | Behaviors that require immediate stop-and-fix |
| [what-to-ignore.md](./what-to-ignore.md) | Files and features to skip for now |

---

## Phase Guides

### Phase 1: Foundation
*Get the dashboard running locally*

| Document | Purpose |
|----------|---------|
| [checklist.md](./01-phase-1-foundation/checklist.md) | Setup verification checkboxes |
| [docker-explained.md](./01-phase-1-foundation/docker-explained.md) | Plain-English Docker guide for the team |
| [project-anatomy.md](./01-phase-1-foundation/project-anatomy.md) | Map of the codebase structure |
| [knowledge-sources.md](./01-phase-1-foundation/knowledge-sources.md) | Where training content lives |
| [troubleshooting.md](./01-phase-1-foundation/troubleshooting.md) | Common issues and solutions |

### Phase 2: Core Chatbot
*Build a chatbot that works*

| Document | Purpose |
|----------|---------|
| [checklist.md](./02-phase-2-core-chatbot/checklist.md) | Backend, Frontend, and Integration verification |
| [architecture.md](./02-phase-2-core-chatbot/architecture.md) | Request/response flow through the system |
| [backend-guide.md](./02-phase-2-core-chatbot/backend-guide.md) | OpenAI integration and endpoint creation |
| [frontend-guide.md](./02-phase-2-core-chatbot/frontend-guide.md) | React component patterns and implementation |
| [integration-points.md](./02-phase-2-core-chatbot/integration-points.md) | Specific files to create and modify |

### Phase 3: Smart Chatbot
*Make it know the training content*

| Document | Purpose |
|----------|---------|
| [checklist.md](./03-phase-3-smart-chatbot/checklist.md) | Memory, context, and session verification |
| [conversation-memory.md](./03-phase-3-smart-chatbot/conversation-memory.md) | How to store and use chat history |
| [context-awareness.md](./03-phase-3-smart-chatbot/context-awareness.md) | Making the bot aware of current page/module |
| [user-sessions.md](./03-phase-3-smart-chatbot/user-sessions.md) | Connecting chat to authenticated users |

### Phase 4: Builder Engine
*Generate customized training content*

| Document | Purpose |
|----------|---------|
| [checklist.md](./04-phase-4-builder-engine/checklist.md) | Builder feature verification |
| [the-vision.md](./04-phase-4-builder-engine/the-vision.md) | What the builder engine enables |
| [questionnaire-design.md](./04-phase-4-builder-engine/questionnaire-design.md) | Questions that drive content generation |
| [content-generation.md](./04-phase-4-builder-engine/content-generation.md) | AI-powered template processing |
| [dynamic-loading.md](./04-phase-4-builder-engine/dynamic-loading.md) | Loading different knowledge bases per client |

---

## Reference Materials

### Concepts
*Background knowledge the team needs*

| Document | Purpose |
|----------|---------|
| [docker-101.md](./concepts/docker-101.md) | Container basics for beginners |
| [openai-agents.md](./concepts/openai-agents.md) | How to use the OpenAI API effectively |
| [how-the-dashboard-works.md](./concepts/how-the-dashboard-works.md) | Understanding the inherited codebase |
| [adding-to-existing-code.md](./concepts/adding-to-existing-code.md) | Following patterns instead of inventing new ones |

### Diagrams
*Visual representations of architecture*

| Document | Purpose |
|----------|---------|
| [architecture-overview.md](./diagrams/architecture-overview.md) | Big picture system diagram |
| [chat-flow.md](./diagrams/chat-flow.md) | Message flow from user to AI and back |
| [knowledge-base-structure.md](./diagrams/knowledge-base-structure.md) | How training content is organized |
| [builder-engine-flow.md](./diagrams/builder-engine-flow.md) | Questionnaire to generated content flow |
| [file-tree-annotated.md](./diagrams/file-tree-annotated.md) | Codebase structure with annotations |

### Snippets
*Code patterns and guidance*

| Document | Purpose |
|----------|---------|
| [backend-chat-endpoint.md](./snippets/backend-chat-endpoint.md) | FastAPI endpoint pattern for chat |
| [frontend-chat-component.md](./snippets/frontend-chat-component.md) | React component structure for chat UI |
| [knowledge-base-loading.md](./snippets/knowledge-base-loading.md) | Loading and injecting training content |

---

## How to Use This Guide

1. **Everyone:** Start with `00-overview.md` and `priority-stack.md`
2. **Work through phases in order** - Phase 2 depends on Phase 1, etc.
3. **Use checklists** to verify each phase is complete before moving on
4. **Reference concepts** when you need background on a technology
5. **Check diagrams** when you need to understand how pieces connect
6. **Use snippets** as starting points for implementation

**Remember:** Running beats planning. If the chatbot doesn't work, nothing else matters.
