# Loading the Knowledge Base

## What you're accomplishing
Give the AI context so it can answer questions intelligently.

## Sources to load
- data/faq.json - Q&A pairs
- data/categories.json - training categories
- data/questions.json - assessment questions

## How to format for the prompt
Transform JSON to readable text:
Bad: {"question": "What is phishing?", "answer": "..."}
Good: Q: What is phishing?\nA: Phishing is...

## Best practices
- Load once at startup, cache in memory
- If content is large, consider chunking
- Include source attribution for AI responses
