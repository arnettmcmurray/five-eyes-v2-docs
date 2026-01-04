# Red Flags

## If You Catch Yourself Doing These, Stop Immediately

---

### Trying to host before it runs locally

**Stop.** If you can't run it on your machine, you can't debug it. Hosting platforms give worse error messages than local development. Get it running locally first.

---

### Adding auth/payments before chatbot works

**Stop.** You can't authenticate access to something that doesn't exist. You can't charge for something that doesn't work. Build the thing first.

---

### Building UI for features that don't exist

**Stop.** Don't create a beautiful chat window if there's no backend to talk to. Don't build a questionnaire form if there's no content generator. Wire up the functionality first, make it pretty later.

---

### Spending more than 30 minutes on anything that isn't Priority 1 or 2

**Stop.** If the core chatbot doesn't work, nothing else matters. Check `priority-stack.md`. If you're working on Priority 3+ stuff and Priority 2 isn't done, you're wasting time.

---

### Working in the scaffolded repo instead of the dashboard repo

**Stop.** The scaffolded repo (`ai-training-module-w-bot` or similar) is full of placeholders that don't work. The dashboard is your foundation. Build on what works.

---

### "Planning" or "researching" when Priority 2 isn't done

**Stop.** Planning is procrastination if you haven't proven the core works. Research is avoidance. Build something. See if it works. Then plan the next thing.

---

### Creating new patterns instead of following existing ones

**Stop.** The dashboard already has patterns for routes, components, and API calls. Don't invent new conventions. Look at how they did it and copy the structure.

---

### Adding "nice to have" features before "must have" works

**Stop.** Conversation memory is nice. Context awareness is nice. But if the basic chatbot doesn't respond, none of that matters. Basics first.

---

### Scaffolding future features

**Stop.** Don't create empty folders for "payments" or "subscriptions" or "multi-tenant." Don't import libraries you're not using yet. Don't create placeholder routes. Build what you need now.

---

### Waiting for someone else before you can do anything

**Stop.** If you're blocked, either help unblock them or find something else in your track to work on. Don't sit idle. There's always something to do.

---

### Having meetings about what to build instead of building

**Stop.** A quick sync is fine. A 2-hour architecture discussion when nothing works is not. Build something, then discuss if it's the right thing.

---

### Perfectioning one thing while other things are broken

**Stop.** Don't spend 3 hours making the chat UI pixel-perfect if the backend doesn't respond. Get everything working at a basic level, then polish.

---

## The Question to Ask Yourself

> "Does the core chatbot work end-to-end right now?"

If **yes**: Carry on with what you're doing.

If **no**: Why are you doing anything else?
