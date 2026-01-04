# Dynamic Loading: Multi-Tenant Knowledge Base

## Overview

Dynamic loading is what makes the builder engine feel like magic. The same chatbot codebase can instantly switch between different clients' customized training content, creating the illusion that each client has their own dedicated chatbot.

## The Challenge

**Problem**: How does one chatbot serve multiple clients with completely different training content?

**Solution**: The chatbot dynamically loads the appropriate knowledge base based on which client instance is accessing it.

## Core Concept

Think of it like a library with multiple specialized collections:

- **Physical library building** = The chatbot codebase (same for everyone)
- **Different book collections** = Each client's generated training content
- **Library card** = Client authentication/identifier
- **Librarian** = Dynamic loading system that fetches the right books

When a user logs in, the system:
1. Identifies which client they belong to
2. Loads that client's generated training content
3. The chatbot responds using only that client's knowledge base
4. The user never sees content from other clients

## File Structure for Generated Instances

### Recommended Organization

```
/arnett-data/
  /generated-content/
    /healthcare-corp-001/
      /modules/
        phishing-awareness.md
        password-security.md
        social-engineering.md
        data-protection.md
      /scenarios/
        slack-phishing-examples.md
        hipaa-breach-scenarios.md
      /chat-context/
        system-prompt.md
        response-guidelines.md
      metadata.json

    /finance-inc-002/
      /modules/
        phishing-awareness.md
        password-security.md
        social-engineering.md
        wire-transfer-security.md
      /scenarios/
        teams-phishing-examples.md
        bec-attack-scenarios.md
      /chat-context/
        system-prompt.md
        response-guidelines.md
      metadata.json

    /retail-co-003/
      /modules/
        phishing-awareness.md
        password-security.md
        pos-security.md
      /scenarios/
        email-phishing-examples.md
        social-engineering-retail.md
      /chat-context/
        system-prompt.md
        response-guidelines.md
      metadata.json
```

### Client Metadata Example

```json
{
  "client_id": "healthcare-corp-001",
  "company_name": "Healthcare Corp",
  "industry": "healthcare",
  "generated_at": "2024-01-15T10:32:45Z",
  "active": true,
  "subscription_tier": "standard",
  "knowledge_base_path": "/arnett-data/generated-content/healthcare-corp-001",
  "modules": [
    "phishing-awareness",
    "password-security",
    "social-engineering",
    "data-protection"
  ],
  "custom_system_prompt": true,
  "branding": {
    "logo_url": null,
    "primary_color": null
  }
}
```

## Loading Mechanism

### Step 1: Client Identification

When a user accesses the chatbot, determine which client they belong to:

**Option A: Subdomain-based**
```
healthcare-corp.arnett.ai → client_id: healthcare-corp-001
finance-inc.arnett.ai → client_id: finance-inc-002
retail-co.arnett.ai → client_id: retail-co-003
```

**Option B: Login-based**
```
User logs in with email: sarah@healthcarecorp.com
System looks up: email domain → client_id
Loads knowledge base for that client
```

**Option C: Direct URL parameter** (simplest for MVP)
```
arnett.ai/chat?client=healthcare-corp-001
arnett.ai/chat?client=finance-inc-002
```

### Step 2: Knowledge Base Loading

Once client is identified, load their content:

```python
def load_client_knowledge_base(client_id):
    """
    Load all training content for a specific client
    Returns: Dictionary of module content
    """
    base_path = f"/arnett-data/generated-content/{client_id}"

    # Load metadata
    with open(f"{base_path}/metadata.json") as f:
        metadata = json.load(f)

    # Load all modules
    modules = {}
    for module_name in metadata["modules"]:
        module_path = f"{base_path}/modules/{module_name}.md"
        with open(module_path) as f:
            modules[module_name] = f.read()

    # Load scenarios
    scenarios = {}
    scenario_files = os.listdir(f"{base_path}/scenarios")
    for scenario_file in scenario_files:
        with open(f"{base_path}/scenarios/{scenario_file}") as f:
            scenario_name = scenario_file.replace(".md", "")
            scenarios[scenario_name] = f.read()

    # Load custom system prompt if exists
    system_prompt = None
    prompt_path = f"{base_path}/chat-context/system-prompt.md"
    if os.path.exists(prompt_path):
        with open(prompt_path) as f:
            system_prompt = f.read()

    return {
        "client_id": client_id,
        "metadata": metadata,
        "modules": modules,
        "scenarios": scenarios,
        "system_prompt": system_prompt
    }
```

### Step 3: Context Injection

Use the loaded knowledge base to configure the chatbot:

```python
def create_client_chatbot(client_id):
    """
    Create a chatbot instance configured for a specific client
    """
    # Load knowledge base
    knowledge = load_client_knowledge_base(client_id)

    # Build system prompt with client-specific context
    system_prompt = f"""
You are Arnett, a security training assistant for {knowledge['metadata']['company_name']}.

Your knowledge base contains training modules customized for their environment:
- Industry: {knowledge['metadata']['industry']}
- Training modules available: {', '.join(knowledge['metadata']['modules'])}

When answering questions:
1. Reference their specific industry context
2. Use examples from their training scenarios
3. Cite specific modules when relevant
4. Keep answers practical and actionable

Available training content:
{format_knowledge_base_summary(knowledge)}
"""

    # If client has custom system prompt, append it
    if knowledge['system_prompt']:
        system_prompt += f"\n\nAdditional instructions:\n{knowledge['system_prompt']}"

    # Configure chatbot
    chatbot = ArnettChatbot(
        system_prompt=system_prompt,
        knowledge_base=knowledge,
        client_id=client_id
    )

    return chatbot
```

### Step 4: Query Handling

When a user asks a question, the chatbot uses only that client's content:

```python
def handle_user_query(client_id, user_question):
    """
    Process a user query using client-specific knowledge
    """
    # Get or create chatbot instance for this client
    chatbot = get_chatbot_for_client(client_id)

    # Search relevant content from this client's knowledge base
    relevant_content = chatbot.search_knowledge_base(user_question)

    # Generate response using client-specific context
    response = chatbot.generate_response(
        question=user_question,
        context=relevant_content
    )

    return response
```

## Switching Between Clients

### Session-Based Approach

Each user session is tied to one client:

```python
# User 1 logs into Healthcare Corp instance
session_1 = create_session(client_id="healthcare-corp-001")
# All their queries use Healthcare Corp knowledge base

# User 2 logs into Finance Inc instance
session_2 = create_session(client_id="finance-inc-002")
# All their queries use Finance Inc knowledge base

# Sessions are completely isolated
```

### Demo Mode: Manual Switching

For demo purposes, allow instant switching:

```python
# Demo interface
print("Available demo clients:")
print("1. Healthcare Corp (healthcare, remote, Slack)")
print("2. Finance Inc (finance, in-office, Microsoft Teams)")
print("3. Retail Co (retail, hybrid, email)")

choice = input("Select client: ")

if choice == "1":
    client_id = "healthcare-corp-001"
elif choice == "2":
    client_id = "finance-inc-002"
else:
    client_id = "retail-co-003"

chatbot = create_client_chatbot(client_id)
print(f"\nLoaded knowledge base for {chatbot.metadata['company_name']}")
print("Ask a security question...")
```

### Cache Strategy

To avoid reloading content on every query:

```python
# Global cache of loaded knowledge bases
LOADED_CLIENTS = {}

def get_chatbot_for_client(client_id):
    """
    Get cached chatbot or load if not in cache
    """
    if client_id not in LOADED_CLIENTS:
        print(f"Loading knowledge base for {client_id}...")
        LOADED_CLIENTS[client_id] = create_client_chatbot(client_id)

    return LOADED_CLIENTS[client_id]

# First query for healthcare-corp-001: Loads content (slower)
# Subsequent queries: Uses cached content (instant)
```

## Per-Client System Prompts

Each client can have customized chatbot behavior:

### Healthcare Corp System Prompt
```markdown
You are Arnett, a HIPAA-focused security assistant.

When answering questions:
- Always consider patient data protection implications
- Reference HIPAA requirements when relevant
- Use medical terminology appropriately
- Emphasize the severity of breaches in healthcare context
- Be empathetic - healthcare workers are busy and stressed

Examples should involve:
- Patient records and PHI
- Medical devices and systems
- Slack communication (they use Slack)
- Remote work scenarios (they work remotely)
```

### Finance Inc System Prompt
```markdown
You are Arnett, a financial security assistant.

When answering questions:
- Focus on fraud prevention and financial controls
- Reference PCI-DSS and financial regulations
- Emphasize wire transfer and BEC attack risks
- Use precise, professional language
- Acknowledge the high stakes of financial security

Examples should involve:
- Wire transfers and payment processing
- Microsoft Teams communication (they use Teams)
- In-office scenarios (they work on-site)
- Customer financial data protection
```

## Data Isolation

Critical principle: **Client A's chatbot must never access Client B's content**

### Enforcement Mechanisms

1. **Path Validation**
```python
def validate_client_access(requested_client_id, user_session):
    """
    Ensure user can only access their own client's data
    """
    if user_session.client_id != requested_client_id:
        raise PermissionError("Access denied: Cannot access other client's data")
```

2. **Scoped Searches**
```python
def search_knowledge_base(chatbot, query):
    """
    Search only within the chatbot's assigned client knowledge base
    """
    # Restrict search to this client's directory
    search_path = f"/arnett-data/generated-content/{chatbot.client_id}/"
    results = search_documents(query, scope=search_path)
    return results
```

3. **Audit Logging**
```python
def log_knowledge_access(client_id, module_accessed, user_id):
    """
    Track which users access which content for security auditing
    """
    log_entry = {
        "timestamp": datetime.now(),
        "client_id": client_id,
        "module": module_accessed,
        "user_id": user_id
    }
    audit_log.append(log_entry)
```

## Demo Day Scenario

### Live Demonstration Flow

**Setup**: Pre-generate content for 2-3 demo clients

**Demo Script**:

1. **Introduction**
   - "We've built a SaaS platform that creates customized security training"
   - "Same chatbot, different knowledge for each client"

2. **Show Healthcare Corp**
   - Load Healthcare Corp instance
   - Ask: "What should I know about phishing attacks?"
   - Chatbot responds with HIPAA context, patient data references, Slack examples
   - "Notice it's focused on healthcare and uses their tools"

3. **Switch to Finance Inc**
   - Load Finance Inc instance
   - Ask the same question: "What should I know about phishing attacks?"
   - Chatbot responds with financial fraud context, wire transfer risks, Teams examples
   - "Same question, completely different answer"

4. **Show the Files**
   - Briefly show the directory structure
   - "Each client has their own generated training modules"
   - "The chatbot loads the right content based on who's logged in"

5. **The Value Prop**
   - "One platform serves infinite clients"
   - "Each gets customized training without manual content creation"
   - "This is scalable, automated, and valuable"

## MVP Simplifications

For Phase 4 demo, you can simplify:

### Option 1: Hardcoded Demo Clients

Just create 2 pre-generated instances:
- Healthcare Corp (static files, not actually generated)
- Finance Inc (static files, not actually generated)
- Manual switching via command or UI dropdown

### Option 2: Single Client with Regeneration

Focus on one client:
- Show questionnaire
- Generate content
- Load it into chatbot
- Then change one questionnaire answer and regenerate
- Show how the content changes

### Option 3: Side-by-Side Comparison

Create a split-screen demo:
- Left side: Healthcare chatbot
- Right side: Finance chatbot
- Ask same question to both
- Show different responses simultaneously

## Success Criteria

Phase 4 dynamic loading is successful if:

1. **Content isolation**: Asking healthcare chatbot about finance training returns "I don't have that information"
2. **Relevant responses**: Answers reference the client's specific industry and tools
3. **Switching works**: Can demo 2+ different clients in under 5 minutes
4. **Explainable**: Can clearly show/explain how the loading mechanism works
5. **Impressive**: Audience says "wow, that's cool" when you switch between instances

## Technical Considerations

### Performance

- Loading knowledge base should take < 2 seconds
- Cache loaded content to avoid repeated file reads
- Use async loading if possible during user authentication

### Scalability

For production (beyond Phase 4):
- Move from file system to database for better performance at scale
- Implement lazy loading (load modules on-demand, not all at once)
- Add CDN for static content
- Consider vector database for semantic search across large content sets

### Error Handling

What if content is missing or corrupted?

```python
def safe_load_client_knowledge(client_id):
    try:
        return load_client_knowledge_base(client_id)
    except FileNotFoundError:
        # Fall back to default generic content
        logger.error(f"Knowledge base not found for {client_id}")
        return load_default_knowledge_base()
    except Exception as e:
        logger.error(f"Error loading knowledge base: {e}")
        return {"error": "Content temporarily unavailable"}
```

## Future Enhancements (Post-Phase 4)

Once basic dynamic loading works:

- **Real-time updates**: Regenerate content without restarting chatbot
- **A/B testing**: Show different versions to different users
- **Analytics**: Track which modules are most accessed per client
- **Personalization**: User-level customization on top of client-level
- **Hybrid knowledge**: Combine client-specific + universal security content
- **Multi-language**: Load content in different languages per client preference

## Phase 4 Reality Check

This is the feature that makes investors excited, but remember:

- **It's the cherry on top**, not the foundation
- A working chatbot with static content is more valuable than a broken dynamic loading system
- Even a simplified version (2 hardcoded demo clients) proves the concept
- Focus on making it demo-able, not production-ready
- The explanation matters as much as the implementation

If you can show different clients getting different responses and explain how it enables a SaaS business model, Phase 4 is a success.
