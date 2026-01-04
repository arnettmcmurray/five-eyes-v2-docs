# Builder Engine Flow (Phase 4)

This diagram shows how the dashboard builder creates custom client instances from questionnaire responses.

```
┌─────────────────────────────────────────────────────────────────────┐
│                      BUILDER ENGINE FLOW                            │
│                    (Custom Dashboard Creation)                      │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│ STEP 1: QUESTIONNAIRE                                                │
└───────────────────────────────┬──────────────────────────────────────┘
                                │
                     ┌──────────▼──────────┐
                     │  Client Completes   │
                     │   Intake Form       │
                     └──────────┬──────────┘
                                │
            ┌───────────────────┼───────────────────┐
            ▼                   ▼                   ▼
     ┌───────────┐       ┌───────────┐      ┌──────────────┐
     │ Industry  │       │ Team Size │      │ Tools/Systems│
     │           │       │           │      │              │
     │Healthcare │       │ 50-100    │      │ Okta, Azure  │
     │Finance    │       │ 100-500   │      │ Salesforce   │
     │Tech       │       │ 500+      │      │ Custom ERP   │
     └───────────┘       └───────────┘      └──────────────┘
            │                   │                   │
            │       ┌───────────┼────────┐         │
            │       ▼           ▼        ▼         │
            │  ┌─────────┐ ┌────────┐ ┌─────────┐ │
            │  │Maturity │ │Budget  │ │Timeline │ │
            │  │Level    │ │        │ │         │ │
            │  └─────────┘ └────────┘ └─────────┘ │
            │                   │                  │
            └───────────────────┼──────────────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │   Questionnaire     │
                     │   Responses Saved   │
                     │  (answers.json)     │
                     └──────────┬──────────┘
                                │
                                │
┌───────────────────────────────▼──────────────────────────────────────┐
│ STEP 2: AI CONTENT GENERATION                                        │
└──────────────────────────────────────────────────────────────────────┘
                                │
                     ┌──────────▼──────────┐
                     │  Builder Engine     │
                     │  (AI Service)       │
                     └──────────┬──────────┘
                                │
            ┌───────────────────┼───────────────────┐
            ▼                   ▼                   ▼
     ┌─────────────┐     ┌─────────────┐    ┌──────────────┐
     │Generate     │     │Generate     │    │Generate      │
     │Training     │     │Quizzes      │    │Chatbot       │
     │Modules      │     │             │    │Knowledge     │
     └──────┬──────┘     └──────┬──────┘    └──────┬───────┘
            │                   │                   │
            │                   │                   │
      Uses Templates      Uses Templates      Uses Templates
      + Client Data       + Client Data       + Client Data
            │                   │                   │
            ▼                   ▼                   ▼
     ┌─────────────┐     ┌─────────────┐    ┌──────────────┐
     │ custom_     │     │ custom_     │    │ knowledge    │
     │ modules/    │     │ quizzes/    │    │ .json        │
     │ *.json      │     │ *.json      │    │              │
     └─────────────┘     └─────────────┘    └──────────────┘
            │                   │                   │
            └───────────────────┼───────────────────┘
                                │
                                │
┌───────────────────────────────▼──────────────────────────────────────┐
│ STEP 3: INSTANCE CREATION                                            │
└──────────────────────────────────────────────────────────────────────┘
                                │
                     ┌──────────▼──────────┐
                     │  Create Client      │
                     │  Directory          │
                     └──────────┬──────────┘
                                │
                                ▼
                     /clients/{client_name}/
                                │
            ┌───────────────────┼───────────────────┐
            ▼                   ▼                   ▼
     ┌─────────────┐     ┌─────────────┐    ┌──────────────┐
     │ modules/    │     │ quizzes/    │    │ knowledge    │
     │             │     │             │    │ .json        │
     └─────────────┘     └─────────────┘    └──────────────┘
            ▼                   ▼                   ▼
     ┌─────────────┐     ┌─────────────┐    ┌──────────────┐
     │ config.json │     │ branding/   │    │ data/        │
     │             │     │ logo.png    │    │ overrides    │
     └─────────────┘     └─────────────┘    └──────────────┘
            │                   │                   │
            └───────────────────┼───────────────────┘
                                │
                                ▼
                     ┌─────────────────────┐
                     │   Deploy Client     │
                     │   Dashboard         │
                     │                     │
                     │  {client}.arnett.io │
                     └─────────────────────┘
```

## Detailed Flow

### STEP 1: Questionnaire Input

**Questions Asked:**
```
Industry:               [ Healthcare ]
Team Size:              [ 100-500 ]
Primary Tools:          [ Okta, Azure AD, Salesforce ]
Compliance Needs:       [ HIPAA, SOC2 ]
Security Maturity:      [ Level 2 - Developing ]
Budget Range:           [ $10k-$50k ]
Timeline:               [ 3 months ]
Specific Pain Points:   [ Manual access reviews, no MFA ]
```

**Output:** `/builder/responses/{client_id}/answers.json`

### STEP 2: AI Content Generation

**Input to AI:**
- Questionnaire responses (answers.json)
- Template modules (from /templates/modules/)
- Template quizzes (from /templates/quizzes/)
- Knowledge base templates (from /templates/knowledge/)

**AI Processing:**
```
FOR each template module:
  - Read template structure
  - Inject client-specific examples
  - Add industry terminology
  - Include tool-specific screenshots
  - Generate practice scenarios

FOR each template quiz:
  - Adapt questions to client tools
  - Add industry-specific scenarios
  - Include client workflow examples

FOR knowledge base:
  - Extract FAQ from questionnaire pain points
  - Add tool-specific troubleshooting
  - Include compliance-specific answers
```

**Output Files Generated:**
```
/temp/{client_id}/
├─ modules/
│  ├─ custom_access_management.json
│  ├─ custom_mfa_setup.json
│  └─ custom_audit_compliance.json
├─ quizzes/
│  ├─ custom_quiz_access.json
│  └─ custom_quiz_audit.json
└─ knowledge.json
```

### STEP 3: Instance Creation

**File Structure Created:**
```
/clients/acme-healthcare/
├─ config.json              # Client settings, branding, feature flags
├─ modules/
│  ├─ custom_access_management.json
│  ├─ custom_mfa_setup.json
│  └─ custom_audit_compliance.json
├─ quizzes/
│  ├─ custom_quiz_access.json
│  └─ custom_quiz_audit.json
├─ knowledge.json           # Chatbot knowledge base
├─ branding/
│  ├─ logo.png
│  ├─ colors.json
│  └─ theme.css
└─ data/
   └─ overrides.json        # Client-specific data overrides
```

**Deployment:**
```
1. Copy generated files to client directory
2. Configure subdomain: acme-healthcare.arnett.io
3. Set environment variables
4. Deploy instance
5. Send client login credentials
```

## Example: Healthcare Client

**Input (Questionnaire):**
```json
{
  "industry": "Healthcare",
  "team_size": "100-500",
  "tools": ["Okta", "Epic EMR", "Azure AD"],
  "compliance": ["HIPAA", "HITRUST"],
  "pain_points": ["Manual access reviews", "No audit trail"]
}
```

**Generated Module Example:**
```json
{
  "id": "custom_access_mgmt_acme",
  "title": "Access Management for Healthcare",
  "content": "In a healthcare setting with Epic EMR...",
  "examples": [
    "Granting nurse access to patient records",
    "Revoking terminated physician credentials",
    "Audit trail for HIPAA compliance"
  ],
  "tools_covered": ["Okta", "Epic EMR", "Azure AD"]
}
```

**Generated Knowledge (Chatbot):**
```json
{
  "faq": [
    {
      "question": "How do I review Epic EMR access?",
      "answer": "Navigate to Okta dashboard, filter by Epic EMR app..."
    },
    {
      "question": "What are HIPAA audit requirements?",
      "answer": "HIPAA requires maintaining access logs for 6 years..."
    }
  ]
}
```

## Builder Engine Technology

**AI Model:** GPT-4 with custom prompts
**Templates:** JSON schemas with placeholder variables
**Processing Time:** 2-5 minutes per client
**Output Quality:** Human review recommended before deployment
