# Knowledge Base Structure

This diagram shows what information the AI chatbot has access to and where it comes from.

```
┌─────────────────────────────────────────────────────────────────┐
│                    CHATBOT KNOWLEDGE BASE                       │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌────────────────┐    ┌─────────────────┐
│ STATIC CONTENT│    │DYNAMIC CONTEXT │    │GENERATED CONTENT│
│  (Pre-loaded) │    │(Per-request)   │    │  (Phase 4)      │
└───────┬───────┘    └────────┬───────┘    └────────┬────────┘
        │                     │                     │
        │                     │                     │
        ▼                     ▼                     ▼

━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━━
STATIC CONTENT      DYNAMIC CONTEXT     GENERATED CONTENT
━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━━

📁 data/           📍 Current Page      📁 clients/
├─ faq.json        ├─ /dashboard        ├─ acme-corp/
│  ├─ General      ├─ /access-mgmt      │  ├─ modules/
│  ├─ Technical    └─ /audit-log        │  │  └─ custom_*.json
│  └─ Security                          │  ├─ quizzes/
│                  👤 User Progress      │  │  └─ custom_*.json
├─ categories.json ├─ Modules complete  │  └─ knowledge.json
│  ├─ Modules      ├─ Quiz scores       │
│  └─ Controls     └─ Time spent        └─ widgets-inc/
│                                          └─ knowledge.json
├─ questions.json  💬 Conversation
│  └─ Quiz Qs      ├─ History (last 10)
│                  ├─ Message ID
└─ controls.json   └─ Timestamps
   ├─ AC-1
   ├─ AC-2
   └─ ...

━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━━
SOURCE             SOURCE               SOURCE
━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━━

/dashboard/        HTTP Request         Builder Engine
data/              Headers              (AI-generated)
```

## Knowledge Source Details

### 1. STATIC CONTENT (Always Available)

**File: `/dashboard/data/faq.json`**
- General questions (passwords, access, basics)
- Technical questions (integrations, APIs)
- Security questions (MFA, compliance)

**File: `/dashboard/data/categories.json`**
- Training module metadata
- Control family groupings
- Module descriptions and prerequisites

**File: `/dashboard/data/questions.json`**
- Quiz questions and answers
- Module assessment data
- Correct/incorrect answer explanations

**File: `/dashboard/data/controls.json`**
- NIST 800-53 control definitions
- Implementation guidance
- Control relationships

### 2. DYNAMIC CONTEXT (Provided Per Request)

**Current Page/Module**
```json
{
  "current_page": "access-management",
  "module_id": "mod_003",
  "section": "training"
}
```

**User Progress**
```json
{
  "modules_completed": ["mod_001", "mod_002"],
  "quiz_scores": {"mod_001": 85, "mod_002": 92},
  "time_spent_minutes": 45
}
```

**Conversation History**
```json
{
  "conversation_id": "conv_123",
  "messages": [
    {"role": "user", "content": "What is MFA?"},
    {"role": "assistant", "content": "MFA stands for..."}
  ]
}
```

### 3. GENERATED CONTENT (Phase 4 - Custom Clients)

**File: `/clients/{client_name}/knowledge.json`**
- Custom FAQ for this client
- Client-specific terminology
- Industry-specific examples
- Custom training content

**File: `/clients/{client_name}/modules/custom_*.json`**
- Tailored training modules
- Client workflow examples
- Tool-specific guidance

## Prompt Construction Flow

```
┌─────────────────────────────────────────────────────┐
│ STEP 1: Load Static Content                        │
│   Read: faq.json, categories.json, controls.json   │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ STEP 2: Add Dynamic Context                        │
│   Include: current page, user progress, history    │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ STEP 3: Load Generated Content (if Phase 4)        │
│   Read: /clients/{client}/knowledge.json            │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ STEP 4: Build Final Prompt                         │
│   System Instructions                              │
│   + Knowledge Base                                 │
│   + User Context                                   │
│   + Conversation History                           │
│   + User Message                                   │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
              Send to OpenAI
```

## Example: Knowledge Priority

When a user asks "How do I reset my password?":

1. Check STATIC FAQ (faq.json) - Found general answer
2. Check DYNAMIC CONTEXT - User is on "access-management" page
3. Check GENERATED CONTENT - Client has custom SSO setup
4. Combine: Provide general answer + mention client-specific SSO option

**Result**: Context-aware, personalized response
