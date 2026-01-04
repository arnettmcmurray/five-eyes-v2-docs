# Content Generation

## Overview

Content generation is where the builder engine's "magic" happens. The AI takes questionnaire responses, applies them to content templates, and produces customized training modules that feel hand-crafted for each specific company.

## Template Structure

### Module Template Format

Each training module follows a consistent structure:

```markdown
# [TOPIC]

## Overview
[Brief introduction to the security topic]

## Why This Matters for [INDUSTRY]
[Industry-specific context and risks]

## Common Attack Scenarios

### Scenario 1: [ATTACK TYPE] via [TOOL/PLATFORM]
[Detailed example using the company's actual tools]

**Red Flags:**
- [Warning sign 1]
- [Warning sign 2]
- [Warning sign 3]

**What to Do:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

### Scenario 2: [SECOND ATTACK TYPE]
[Another example relevant to their work arrangement or industry]

## Best Practices for [TEAM_SIZE] Teams
[Recommendations scaled to their organizational size]

## Quick Reference
- DO: [Action 1]
- DO: [Action 2]
- DON'T: [Action 3]
- DON'T: [Action 4]

## Additional Resources
[Links to relevant compliance frameworks, tools, or guides]
```

### Template Variables

Variables that get replaced during generation:

- `[TOPIC]` → "Phishing Awareness", "Password Security", etc.
- `[INDUSTRY]` → From questionnaire response
- `[TOOL/PLATFORM]` → From tools selection
- `[ATTACK_TYPE]` → Generated based on industry + tools
- `[TEAM_SIZE]` → From questionnaire response

## AI Generation Process

### Step 1: Prepare Context

Compile questionnaire responses into a structured prompt:

```
Company Profile:
- Industry: Healthcare
- Team Size: 51-200 employees
- Tools: Slack, Google Workspace, AWS
- Work Arrangement: Hybrid
- Training Experience: Never received formal training

Task: Generate a phishing awareness training module customized for this profile.
```

### Step 2: Apply Template Logic

The AI uses the template structure and fills in customized content:

**Generic Template Section:**
```markdown
## Common Attack Scenarios

### Scenario 1: [ATTACK_TYPE] via [TOOL]
[Example of a phishing attack]
```

**Generated Output for Healthcare + Slack:**
```markdown
## Common Attack Scenarios

### Scenario 1: Fake IT Alert via Slack

You receive a Slack direct message that appears to be from your IT department:

"🔴 URGENT: Your access to patient records will be suspended in 1 hour due to security verification failure. Click here to verify your credentials immediately: [link]"

This is a phishing attempt designed to steal your login credentials and potentially compromise patient data (HIPAA violation).

**Red Flags:**
- Urgent language designed to bypass critical thinking
- Unsolicited request for credential verification
- IT department typically doesn't use Slack DMs for security issues
- Generic greeting instead of your name
- Link preview shows suspicious domain (not your company's IT portal)
```

**Same Template for Finance + Microsoft Teams:**
```markdown
## Common Attack Scenarios

### Scenario 1: Fraudulent Wire Transfer Request via Teams

You receive a Microsoft Teams message that appears to be from your CFO:

"Need to process an urgent wire transfer for the acquisition closing today. Our banking portal is down. Can you initiate $150,000 transfer to this account? Details attached."

This is a business email compromise (BEC) attack targeting financial transactions.

**Red Flags:**
- Unusual urgency and bypass of normal approval process
- Request to use alternative communication channel
- High-value transaction via chat instead of formal request
- Lack of verification through established wire transfer protocols
- Potential for violating financial controls and compliance requirements
```

### Step 3: Context-Aware Recommendations

The AI adjusts advice based on team size and experience:

**For Small Team (1-10) with No Training:**
```markdown
## Best Practices for Small Teams

Since you're a small team without dedicated IT security:
- Designate one person as the "security champion" to stay informed
- Use built-in security features (Google's phishing warnings, Slack's link scanning)
- Establish a simple rule: Never click links in unexpected messages
- Create a shared Slack channel for reporting suspicious messages
- Schedule monthly 15-minute security check-ins
```

**For Large Team (201-1000) with Existing Training:**
```markdown
## Best Practices for Enterprise Organizations

Building on your existing security program:
- Integrate phishing simulations into quarterly testing cycles
- Leverage your security team for escalation and investigation
- Implement automated threat detection in your email gateway
- Ensure consistency between this training and your security policies
- Track phishing report metrics to identify high-risk departments
```

### Step 4: Compliance Integration

For regulated industries, automatically include relevant frameworks:

**Healthcare (HIPAA):**
```markdown
## HIPAA Compliance Considerations

Falling for phishing attacks can lead to:
- Unauthorized access to protected health information (PHI)
- Breach notification requirements (costly and damaging to reputation)
- Potential fines up to $50,000 per violation
- Legal liability and loss of patient trust

Your responsibility under HIPAA includes protecting credentials that access PHI.
```

**Finance (PCI-DSS):**
```markdown
## PCI-DSS Compliance Considerations

Phishing compromises can result in:
- Loss of payment card data (PCI-DSS violation)
- Forensic investigation costs (typically $50,000+)
- Potential loss of ability to process credit cards
- Fines from card brands and acquiring banks
- Mandatory security audits and monitoring

Protecting your credentials is a PCI-DSS requirement.
```

## Output Format

### File-Based Output

Generated content is saved as markdown files:

```
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
    metadata.json
```

### Metadata File

```json
{
  "client_id": "healthcare-corp-001",
  "company_name": "Healthcare Corp",
  "generated_at": "2024-01-15T10:32:45Z",
  "questionnaire_responses": {
    "industry": "healthcare",
    "team_size": "51-200",
    "tools": ["slack", "google-workspace", "aws"],
    "work_arrangement": "hybrid",
    "training_experience": "never"
  },
  "modules_generated": [
    "phishing-awareness",
    "password-security",
    "social-engineering",
    "data-protection"
  ],
  "version": "1.0",
  "regeneration_count": 0
}
```

### Database Output (Alternative)

If using a database instead of files:

```sql
CREATE TABLE generated_content (
  id SERIAL PRIMARY KEY,
  client_id VARCHAR(255),
  module_name VARCHAR(255),
  content TEXT,
  created_at TIMESTAMP,
  questionnaire_data JSONB,
  version INTEGER
);
```

## Example: End-to-End Generation

### Input (Questionnaire Responses)

```json
{
  "industry": "healthcare",
  "team_size": "51-200",
  "tools": ["slack"],
  "work_arrangement": "remote",
  "training_experience": "never"
}
```

### Processing

1. **Select Modules**: Based on "never" trained → Start with fundamentals
   - Phishing Awareness (critical for remote workers)
   - Password Security (foundation topic)
   - Secure Communication (Slack-specific)

2. **Generate Phishing Module**:
   - Use healthcare terminology (patients, PHI, HIPAA)
   - Create Slack-based phishing examples
   - Emphasize remote work risks (home networks, public WiFi)
   - Keep language accessible for first-time learners

3. **Generate Password Module**:
   - Healthcare context: "Password protects access to patient records"
   - Slack-specific: "Don't share passwords via Slack"
   - Remote work: "Don't let family members use your work computer"
   - Basic education: Explain what makes a strong password

### Output (Excerpt from Generated Phishing Module)

```markdown
# Phishing Awareness for Healthcare Teams

## Overview

Phishing is when attackers pretend to be someone trustworthy to trick you into revealing sensitive information or clicking malicious links. In healthcare, successful phishing attacks can expose patient data and violate HIPAA regulations.

## Why This Matters for Healthcare

Your credentials provide access to protected health information (PHI). Attackers specifically target healthcare workers because:
- Patient records sell for $250+ on the dark web (vs $5 for credit card numbers)
- Healthcare organizations often have weaker security than banks
- Medical data includes everything needed for identity theft
- HIPAA breach notifications damage organizational reputation and trust

## Common Attack Scenarios

### Scenario 1: Fake IT Alert via Slack

You're working from home and receive this Slack DM:

**Message from "IT Support":**
"Your VPN access will expire in 2 hours. Click here to renew: [link]. Without renewal, you won't be able to access patient records."

**This is a phishing attack.** Here's how to identify it:

**Red Flags:**
- Creates artificial urgency ("2 hours")
- Arrives via DM instead of official IT channel
- Asks you to click a link to "verify" or "renew"
- May use IT Support name but check the Slack profile - is it official?
- Real IT team has your email and phone, they wouldn't only use Slack

**What to Do:**
1. Don't click the link
2. Report the message using Slack's report feature
3. Contact IT directly using the number on your company website
4. Delete the message after reporting

### Scenario 2: Fake Colleague Request

You receive a Slack message from what appears to be a colleague:

"Hey, I'm on my phone and forgot my credentials. Can you send me the link to access [medical record system]? Patient emergency, need it ASAP."

**This is social engineering.** Even if it seems to be from a real colleague, the attacker might have compromised their account.

**Red Flags:**
- Requests credentials or system access via chat
- Claims emergency to pressure quick response
- Asks you to bypass normal security procedures
- Even if the profile looks legitimate, the account might be hacked

**What to Do:**
1. Don't share links or credentials via Slack
2. Call the colleague directly to verify (don't use Slack call - use their phone)
3. If legitimate emergency, direct them to proper IT support channels
4. Report suspicious messages even if from known contacts

## Best Practices for Mid-Size Teams (50-200 People)

Since you're a mid-size organization working remotely:

**DO:**
- Hover over links before clicking (check the actual URL)
- Verify unexpected requests through a second channel (call, not message)
- Use your company's IT support channel in Slack for real tech issues
- Report suspicious messages immediately
- Keep your Slack app updated for latest security features

**DON'T:**
- Click links in unsolicited messages, even from apparent colleagues
- Share your password, ever, with anyone
- Let urgency override your security awareness
- Assume a message is legitimate because the profile looks official
- Access patient records on public WiFi without a VPN

## Remote Work Specific Risks

Working from home increases phishing risk because:
- Attackers know you're on less secure home networks
- No IT team nearby to quickly verify suspicious requests
- More likely to use personal devices that might lack security software
- Family members might accidentally access your work computer

**Extra precautions for remote workers:**
- Lock your computer every time you step away (even at home)
- Don't let family members use your work devices
- Use a VPN when accessing patient records or company systems
- Keep work and personal Slack accounts completely separate

## HIPAA Compliance Considerations

Falling for phishing attacks can lead to:
- Unauthorized access to protected health information (PHI)
- Mandatory breach notifications to patients and authorities
- Fines up to $50,000 per violation
- Personal liability if negligence is proven
- Loss of patient trust and organizational reputation

**Remember**: Clicking a phishing link isn't just a personal mistake - it's a potential HIPAA breach that affects patients and your entire organization.

## When in Doubt

If you receive any message that asks you to:
- Click a link to verify your account
- Share credentials or system access
- Take urgent action outside normal procedures
- Download an unexpected file

**STOP. VERIFY. REPORT.**

Contact IT through official channels before acting. It's always better to double-check than to become the entry point for a data breach.

## Quick Reference Card

Print this and keep it visible:

**🚩 Red Flags:**
- Unexpected urgency
- Requests for credentials
- Generic greetings
- Suspicious links
- Unusual sender behavior

**✅ Safe Actions:**
- Verify through second channel
- Report suspicious messages
- Contact IT when unsure
- Hover before clicking
- Lock your computer

**❌ Never Do:**
- Click unknown links
- Share passwords
- Act on urgent demands without verification
- Access PHI on public WiFi without VPN
- Let non-employees use work devices

---

**Questions?** Ask in the #security-questions Slack channel or contact IT at [IT support contact].
```

## Quality Assurance

### Validation Checks

Before saving generated content:

1. **Completeness**: All template sections filled
2. **Relevance**: Industry terms used appropriately
3. **Accuracy**: No contradictory advice
4. **Specificity**: Tools/platforms mentioned match questionnaire
5. **Readability**: Appropriate for stated experience level

### Human Review (Optional)

For production systems, consider:
- Random sampling of generated content
- Expert review of compliance sections
- User feedback on relevance and clarity
- A/B testing different generation approaches

## Iteration and Improvement

### Version Control

Track content generation versions:
- v1.0: Initial generation from questionnaire
- v1.1: Client requested more AWS-specific content
- v2.0: Regenerated after compliance framework update

### Regeneration Triggers

Allow clients to regenerate content when:
- Their environment changes (new tools adopted)
- They want more advanced content (after completing basics)
- Templates improve (new threat scenarios added)
- Compliance requirements change

## Technical Implementation Notes

### AI Model Selection

- Use Claude (Opus or Sonnet) for content generation
- Provide detailed system prompts with template structure
- Include examples of high-quality output for few-shot learning
- Set temperature to 0.7 for consistent but not robotic output

### Generation Time

- Expect 30-90 seconds per module
- Generate 4-6 modules per client initially
- Run generation asynchronously (don't block the UI)
- Provide progress updates to user

### Cost Considerations

- Each generation costs ~$0.50-2.00 in API fees (depending on model and content length)
- Pre-generate common combinations to reduce costs
- Cache frequently used sections
- Offer regeneration as a premium feature if needed

## Success Metrics

Phase 4 content generation is successful if:

1. **Different inputs → Different outputs**: Healthcare generates different content than Finance
2. **Tool-specific examples**: Slack examples don't appear in Microsoft Teams instances
3. **Appropriate complexity**: Beginners get simpler language than experienced teams
4. **Coherent modules**: Generated content reads naturally, not templated
5. **Demo-ready**: Can generate and show content in under 2 minutes during demo

Even with imperfect generation, proving the concept matters more than perfection in Phase 4.
