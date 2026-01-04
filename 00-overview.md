# Arnett Team Guide - Overview

## The Situation (Let's Be Honest)

You inherited a working dashboard project (Five Eyes Dashboard) from a previous class. It runs. It has content. It's your foundation.

You also built a scaffolded repo with payment routes, auth systems, microservices concepts - and none of it works. That was cart before the horse. Some of that code might be useful later, but right now it's noise.

**Your actual goal:** Build a cybersecurity-focused AI chatbot that integrates with the dashboard.

That's it. Not a multi-tenant SaaS platform. Not a payment system. A chatbot that lives in the dashboard and knows the training content.

---

## The Goals (Tiered)

| Tier | Goal | Timeline |
|------|------|----------|
| **Must Ship** | Chatbot integrated into dashboard, knows training content | Week 4-5 (Demo Day) |
| **Strong Demo** | AI engine that takes questionnaire → generates training module content + loads chatbot with it | Week 4-5 |
| **Continue After** | Full UI for module builder, multi-tenant support, polish | Post-residency |

**"Must Ship" is non-negotiable.** You cannot show up to demo day with scaffolding and excuses.

**"Strong Demo" is achievable** with coaching, AI tools, and focused effort. This is the wow factor - proving you can generate customized training content dynamically.

**"Continue After" is the vision** - where this becomes a real product. But it doesn't matter if you don't ship the basics first.

---

## The Philosophy

### Prove Each Step Before Building the Next

You can't authenticate something that doesn't exist. You can't add payments to a chatbot that doesn't work. You can't host something you can't run locally.

**The order matters:**
1. Get the dashboard running locally (everyone)
2. Build a chatbot that works (talks to OpenAI, gets responses)
3. Attach the chatbot to the dashboard
4. Make the chatbot know the training content
5. Then - maybe - build the fancy stuff

### Running Beats Planning

If you're "planning" and Priority 2 (core chatbot) isn't done, you're wasting time. Build something. See if it works. Then plan the next thing.

### Follow Existing Patterns

The dashboard already has patterns for routes, components, and API calls. Don't invent new conventions. Look at how they did it and copy the structure.

---

## What Success Looks Like (Demo Day)

Picture this:

1. Dashboard runs locally - everyone can access it
2. User logs in and starts a training module
3. They see a chat button in the corner
4. They click it and ask: "What's the best practice for password security?"
5. Chatbot responds intelligently, referencing the training content
6. **Bonus:** Chatbot knows what module they're on and tailors responses

That's it. That's a successful demo. Everything else is gravy.

---

## The Hard Rule (Week 3 Checkpoint)

> **If it's Week 3 and Priority 2 (core chatbot) isn't fully working, STOP EVERYTHING ELSE. All hands on Priority 2.**

No one works on Phase 3 features. No one works on the builder engine. No one "researches" authentication approaches.

Everyone focuses on: Does the chatbot work? Can you click it, ask a question, and get an answer?

If yes - proceed. If no - fix that first.

---

## How to Use This Guide

This folder contains everything you need:

- **Phase folders** (01-04): Step-by-step guidance for each phase
- **concepts/**: Explainers for things you might not know (Docker, OpenAI, etc.)
- **diagrams/**: Visual representations of architecture and flow
- **snippets/**: Code patterns and guidance (not full implementations)
- **Root documents**: Priority stack, team breakdown, red flags

Start with `priority-stack.md` to understand what blocks what. Then work through the phases in order.

**Don't skip ahead.** Phase 2 depends on Phase 1. Phase 3 depends on Phase 2. The order exists for a reason.
