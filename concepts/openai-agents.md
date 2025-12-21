# OpenAI Agents: The Basics

This guide explains how AI agents work in the context of this project. You're using the OpenAI API to build a chatbot that can answer questions about your knowledge base.

## API vs Agents SDK

There are two main ways to build with OpenAI:

**OpenAI API** (what you're using):
- Direct HTTP calls to OpenAI's endpoints
- You control everything: prompt building, message history, tool calling
- More flexible, more work
- Good for custom implementations

**Agents SDK** (what you're NOT using):
- Higher-level framework that handles common patterns
- Built-in conversation management, tool handling
- Less control, easier to start
- Examples: LangChain, OpenAI's Assistants API

For this project, you're using the **OpenAI API directly**. You make HTTP requests to `https://api.openai.com/v1/chat/completions` and get responses back.

## What Is an "Agent"?

In AI terms, an agent is a system that can:

1. **Follow instructions** - You give it a role/goal (system prompt)
2. **Use knowledge** - You provide context it needs (your knowledge base)
3. **Take actions** - It can use tools/functions (optional, you might not need this)

For the Arnett dashboard, your agent is basically:
- **Instructions:** "You are a helpful assistant that answers questions about this course."
- **Knowledge:** The course content you load into the prompt
- **Tools:** None (just answering questions, not taking actions)

Think of it as a very smart search + summarization system.

## The Basic Chat Loop

Here's what happens when a user sends a message:

```
1. User types: "What are the office hours?"
   ↓
2. Your backend builds a prompt:
   - System message: "You are a helpful assistant..."
   - Knowledge base content: [all your course docs]
   - User message: "What are the office hours?"
   ↓
3. Your backend calls OpenAI API:
   POST https://api.openai.com/v1/chat/completions
   ↓
4. OpenAI returns response:
   "Office hours are Tuesdays 2-4pm and Thursdays 3-5pm."
   ↓
5. Your backend sends response to frontend
   ↓
6. User sees the answer
```

The code looks something like:

```python
import openai

response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "You are a helpful assistant..."},
        {"role": "user", "content": "What are the office hours?"}
    ]
)

answer = response.choices[0].message.content
```

## Messages Array

The OpenAI API expects a `messages` array with specific roles:

```python
messages = [
    {
        "role": "system",
        "content": "You are a helpful assistant for CS101. Answer questions based on the course material."
    },
    {
        "role": "user",
        "content": "What are the office hours?"
    },
    {
        "role": "assistant",
        "content": "Office hours are Tuesdays 2-4pm."
    },
    {
        "role": "user",
        "content": "Where are they held?"
    }
]
```

### Role Types

**system:**
- Sets the behavior/personality of the AI
- Usually the first message
- Examples: "You are a helpful teaching assistant" or "You are a sarcastic pirate"

**user:**
- Messages from the human
- The questions being asked

**assistant:**
- Previous responses from the AI
- Used to maintain conversation history
- Lets the AI remember what it said before

For a multi-turn conversation, you keep appending messages to this array.

## Knowledge Base Loading

The AI doesn't magically know about your course. You have to tell it.

**The problem:** GPT-4 doesn't know about your syllabus, assignments, or office hours.

**The solution:** "Stuff" your knowledge base into the prompt.

### Basic Approach

Load your documents and include them in the system message:

```python
# Load knowledge base
syllabus = load_file("syllabus.md")
schedule = load_file("schedule.md")
faq = load_file("faq.md")

knowledge_base = f"""
{syllabus}

{schedule}

{faq}
"""

# Build messages
messages = [
    {
        "role": "system",
        "content": f"""You are a helpful assistant for this course.

Answer questions based on this information:

{knowledge_base}
"""
    },
    {
        "role": "user",
        "content": user_question
    }
]
```

### Token Limits

GPT-4 has a context window (e.g., 8k, 32k, 128k tokens). If your knowledge base + conversation is too big, it won't fit.

**Solutions:**
- Use a model with a bigger window (gpt-4-turbo has 128k tokens)
- Only include relevant sections (search first, then stuff)
- Summarize long documents
- Use embeddings + vector search (advanced, optional)

For this project, if your knowledge base fits in ~100k tokens, just stuff it all in. Easy.

## Response Handling

The API returns JSON:

```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Office hours are Tuesdays 2-4pm."
      }
    }
  ],
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 12,
    "total_tokens": 162
  }
}
```

You extract the answer:

```python
answer = response["choices"][0]["message"]["content"]
```

## Common Patterns

### Stateless Chat (One-Off Questions)

Each request is independent. No conversation history.

```python
messages = [
    {"role": "system", "content": system_prompt},
    {"role": "user", "content": current_question}
]
```

Simple, but can't do follow-ups like "What about Thursday?"

### Stateful Chat (Conversation History)

Keep track of all messages in the conversation:

```python
# Store in session/database
conversation_history = [
    {"role": "system", "content": system_prompt},
    {"role": "user", "content": "What are office hours?"},
    {"role": "assistant", "content": "Tuesdays 2-4pm and Thursdays 3-5pm."},
    {"role": "user", "content": "What about Thursday?"},  # New question
]

# Send entire history
response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=conversation_history
)

# Add response to history
conversation_history.append({
    "role": "assistant",
    "content": response.choices[0].message.content
})
```

More complex, but handles follow-up questions.

## Error Handling

Always handle API errors:

```python
try:
    response = openai.ChatCompletion.create(...)
except openai.error.RateLimitError:
    return "API rate limit exceeded. Try again in a moment."
except openai.error.InvalidRequestError as e:
    return f"Invalid request: {e}"
except Exception as e:
    return "Something went wrong. Please try again."
```

Common errors:
- **RateLimitError:** Too many requests
- **InvalidRequestError:** Malformed request or too many tokens
- **AuthenticationError:** Bad API key

## Cost Awareness

OpenAI charges per token (input + output).

**Example pricing (check current rates):**
- GPT-4: ~$0.03 per 1k input tokens, ~$0.06 per 1k output tokens
- GPT-3.5: Much cheaper, less capable

If you're stuffing 50k tokens of knowledge base into every request, costs add up fast.

**Tips:**
- Use GPT-3.5 for simple questions, GPT-4 for complex ones
- Only include relevant knowledge (not the entire base)
- Monitor usage via OpenAI dashboard

## Going Deeper

This covers the basics. For more:

- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)
- [Chat Completions Guide](https://platform.openai.com/docs/guides/chat)
- [Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [Token Counting](https://platform.openai.com/tokenizer)

## Quick Reference

| Concept | What It Means |
|---------|---------------|
| System message | Instructions for AI behavior |
| User message | Question from human |
| Assistant message | Response from AI |
| Context window | Max tokens the model can process |
| Token | ~4 characters of text |
| Stuffing | Putting knowledge base in the prompt |
| Streaming | Getting response word-by-word (optional) |

Remember: The AI is just completing text. It doesn't "know" anything you don't tell it in the prompt.
