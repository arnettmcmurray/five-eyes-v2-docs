# Knowledge Sources

This guide explains where the training content lives and how it's structured for the chatbot to use.

## Where Training Content Lives

All static training content is stored in the backend:

```
backend/app/data/
├── faq_categories.json     # FAQ category definitions
├── faq_questions.json      # FAQ questions and answers
├── training_modules.json   # Training module metadata
└── training_content/       # Detailed content for each module
    ├── module_1.json
    ├── module_2.json
    └── ...
```

This data gets loaded into the PostgreSQL database when the backend starts up.

## FAQ Data Structure

### faq_categories.json

Defines the categories that organize FAQ questions:

```json
[
  {
    "id": 1,
    "name": "Getting Started",
    "description": "Basic questions for new employees",
    "order": 1
  },
  {
    "id": 2,
    "name": "Benefits",
    "description": "Questions about health insurance, 401k, etc.",
    "order": 2
  }
]
```

**Fields:**
- `id`: Unique identifier
- `name`: Category name shown in the UI
- `description`: What this category covers
- `order`: Display order (lower numbers first)

### faq_questions.json

Contains the actual questions and answers:

```json
[
  {
    "id": 1,
    "category_id": 1,
    "question": "How do I reset my password?",
    "answer": "Go to Settings > Security > Reset Password. You'll receive an email with reset instructions.",
    "order": 1,
    "tags": ["password", "account", "security"]
  },
  {
    "id": 2,
    "category_id": 1,
    "question": "Who do I contact for IT support?",
    "answer": "Email itsupport@company.com or call ext. 5555. Support hours are 8am-6pm EST.",
    "order": 2,
    "tags": ["support", "IT", "help"]
  }
]
```

**Fields:**
- `id`: Unique identifier
- `category_id`: Links to a category in faq_categories.json
- `question`: The question text
- `answer`: The answer text (can include basic markdown)
- `order`: Display order within the category
- `tags`: Keywords for search (optional but helpful)

## Training Module Structure

### training_modules.json

Metadata about each training module:

```json
[
  {
    "id": 1,
    "title": "Company Culture",
    "description": "Learn about our mission, values, and workplace culture",
    "duration_minutes": 15,
    "order": 1,
    "is_required": true,
    "thumbnail_url": "/images/culture.jpg"
  }
]
```

**Fields:**
- `id`: Unique identifier
- `title`: Module name
- `description`: What the module covers
- `duration_minutes`: How long it takes to complete
- `order`: Suggested sequence
- `is_required`: Whether employees must complete it
- `thumbnail_url`: Image for the module card

### training_content/module_X.json

Detailed content for each module:

```json
{
  "module_id": 1,
  "sections": [
    {
      "title": "Our Mission",
      "content": "We exist to make work better for everyone...",
      "type": "text"
    },
    {
      "title": "Core Values",
      "content": "1. Integrity\n2. Innovation\n3. Collaboration",
      "type": "list"
    },
    {
      "title": "Culture Video",
      "content": "https://youtube.com/watch?v=example",
      "type": "video"
    }
  ],
  "quiz": [
    {
      "question": "What is our first core value?",
      "options": ["Integrity", "Innovation", "Speed", "Profit"],
      "correct_answer": 0
    }
  ]
}
```

**Section types:**
- `text`: Paragraph content
- `list`: Bulleted or numbered list
- `video`: Embedded video URL
- `image`: Image URL

**Quiz format:**
- Multiple choice questions
- `correct_answer` is the index of the correct option (0-based)

## How the Chatbot Uses This Data

The chatbot needs to answer employee questions using the FAQ and training content.

### What the Chatbot Knows

When a user asks a question, the chatbot:

1. **Searches FAQ questions** for relevant answers
   - Looks at question text and tags
   - Returns the most relevant FAQ answers

2. **Searches training content** if FAQ doesn't have an answer
   - Looks at module titles, descriptions, and section content
   - Points users to relevant training modules

3. **Combines information** from multiple sources if needed

### Formatting for Chatbot Consumption

To make content easy for the chatbot to understand:

**Use clear, direct language:**
```
Good: "To reset your password, go to Settings > Security > Reset Password."
Bad: "Password resets can be accomplished via the security settings interface."
```

**Include common variations in tags:**
```json
{
  "question": "How do I reset my password?",
  "tags": ["password", "reset", "forgot password", "login", "account"]
}
```

**Structure answers in scannable chunks:**
```
Good:
"To submit a timesheet:
1. Go to the Time Tracking page
2. Click 'New Timesheet'
3. Enter your hours
4. Click 'Submit'"

Bad:
"Timesheets can be submitted by navigating to the Time Tracking page where you'll find a button to create a new timesheet, then you can enter your hours and submit."
```

**Link related topics:**
```json
{
  "question": "How do I enroll in health insurance?",
  "answer": "See the Benefits Enrollment training module for step-by-step instructions. You can also download the enrollment guide from the HR portal.",
  "tags": ["benefits", "health insurance", "enrollment", "HR"]
}
```

## Adding New Content

### Adding a New FAQ

1. Open `backend/app/data/faq_questions.json`
2. Add a new entry with the next available ID
3. Set the appropriate category_id
4. Write a clear question and answer
5. Add relevant tags
6. Restart the backend: `docker compose restart backend`

### Adding a New Training Module

1. Open `backend/app/data/training_modules.json`
2. Add module metadata
3. Create `backend/app/data/training_content/module_X.json`
4. Add sections and quiz questions
5. Restart the backend

### Updating Existing Content

1. Edit the JSON file
2. Restart the backend to reload data
3. Test the changes in the UI and chatbot

## Best Practices

### Writing FAQ Answers

- **Be specific:** "Email hr@company.com" not "Contact HR"
- **Include next steps:** What happens after they do X?
- **Anticipate follow-up questions:** Address them in the answer
- **Use examples:** Show don't just tell
- **Keep it current:** Review and update quarterly

### Organizing Training Content

- **One concept per section:** Don't overload sections
- **Progressive complexity:** Start simple, add detail
- **Visual variety:** Mix text, lists, videos
- **Check understanding:** Add quiz questions for key concepts
- **Realistic duration:** Time yourself reading/watching

### Tagging Strategy

- **Include synonyms:** "PTO", "time off", "vacation"
- **Think like users:** What words would they search?
- **Use common misspellings:** "seperate" for "separate"
- **Add role-specific terms:** "manager approval" for approval questions

### Testing Chatbot Responses

After adding content:

1. Ask the chatbot questions about the new topic
2. Try different phrasings of the same question
3. Check that it returns the right FAQ or module
4. Verify links and references work
5. Test edge cases (partial matches, typos)

## Content Lifecycle

### Initial Population

1. Gather all existing documentation
2. Convert to JSON format
3. Organize into categories
4. Add tags and metadata
5. Load into database

### Ongoing Maintenance

- **Weekly:** Review chatbot logs for unanswered questions
- **Monthly:** Update outdated information
- **Quarterly:** Add new FAQs based on common questions
- **Annually:** Review all training content for relevance

### Version Control

All JSON files are in git, so you can:
- Track changes over time
- Revert bad edits
- See who changed what
- Review changes before they go live

## Advanced: Custom Content Types

You can extend the content structure for your organization's needs:

### Adding Metadata

```json
{
  "question": "What's the PTO policy?",
  "answer": "...",
  "tags": ["PTO", "vacation"],
  "last_updated": "2024-01-15",
  "reviewed_by": "HR Team",
  "audience": ["all", "full-time"]
}
```

### Rich Content

```json
{
  "answer": "To request PTO:\n1. Log into Workday\n2. Go to Time Off\n3. Submit request\n\n[See visual guide](/guides/pto-request.pdf)",
  "attachments": [
    {
      "title": "PTO Request Guide",
      "url": "/guides/pto-request.pdf",
      "type": "pdf"
    }
  ]
}
```

### Multi-Language Support

```json
{
  "question": "How do I reset my password?",
  "question_es": "¿Cómo restablezco mi contraseña?",
  "answer": "Go to Settings > Security > Reset Password.",
  "answer_es": "Ve a Configuración > Seguridad > Restablecer contraseña."
}
```

## Next Steps

Now that you understand the knowledge sources:
- Review the existing FAQ and training content
- Identify gaps in your organization's knowledge base
- Plan what content to add in Phase 2
- Think about how to structure your organization's specific information
