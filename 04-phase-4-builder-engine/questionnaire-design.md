# Questionnaire Design

## Purpose

The questionnaire captures information about a company's environment so the AI can generate customized security training content. The questions need to be specific enough to enable meaningful customization, but not so detailed that they overwhelm the user.

## Core Questions

### 1. Industry

**Question**: "What industry does your company operate in?"

**Options**:
- Healthcare
- Finance/Banking
- Retail/E-commerce
- Technology
- Manufacturing
- Legal
- Education
- Government
- Other

**Why This Matters**:
- Different industries have different compliance requirements (HIPAA, PCI-DSS, GDPR, etc.)
- Attack vectors vary by industry (healthcare faces different threats than retail)
- Examples and scenarios should use industry-specific terminology
- Regulatory frameworks differ significantly

**Customization Impact**:
- Healthcare → HIPAA compliance, patient data protection, medical device security
- Finance → PCI-DSS, fraud prevention, wire transfer scams
- Retail → POS security, customer data protection, supply chain attacks

### 2. Team Size

**Question**: "How many employees are in your organization?"

**Options**:
- 1-10 (Small business)
- 11-50 (Growing startup)
- 51-200 (Mid-size company)
- 201-1000 (Large company)
- 1000+ (Enterprise)

**Why This Matters**:
- Smaller teams need different advice than large enterprises
- Attack sophistication often scales with company size
- Resource availability differs (small teams can't have dedicated security staff)
- Training complexity should match organizational complexity

**Customization Impact**:
- Small teams → Focus on practical, DIY security measures
- Large teams → Discuss security teams, incident response protocols, enterprise tools

### 3. Tools and Platforms

**Question**: "What tools and platforms does your team use?" (Select all that apply)

**Options**:
- Slack
- Microsoft Teams
- Google Workspace
- Microsoft 365
- Zoom
- Salesforce
- AWS
- Azure
- GitHub/GitLab
- Custom internal tools

**Why This Matters**:
- Attackers target specific platforms (phishing emails look different in Gmail vs Outlook)
- Each tool has specific security features and vulnerabilities
- Examples should reference tools employees actually use
- Realistic scenarios require accurate tool representation

**Customization Impact**:
- Slack → Phishing examples showing fake Slack notifications
- Microsoft 365 → OneDrive malware, fake SharePoint links
- AWS → Cloud security, IAM credential protection
- GitHub → Repository security, token protection

### 4. Work Arrangement

**Question**: "What is your team's primary work arrangement?"

**Options**:
- Fully remote
- Hybrid (some remote, some in-office)
- Fully in-office
- Field-based (traveling employees)

**Why This Matters**:
- Remote workers face different security challenges (home networks, public WiFi)
- In-office teams have different threat models (physical security, shoulder surfing)
- Hybrid environments need to address both scenarios
- Field workers need mobile security guidance

**Customization Impact**:
- Remote → Public WiFi safety, home network security, VPN usage
- In-office → Badge security, visitor procedures, screen locks
- Hybrid → Both scenarios, transitioning between environments safely

### 5. Previous Security Training Experience

**Question**: "Has your team received formal security training before?"

**Options**:
- Never
- Yes, but over a year ago
- Yes, within the past year
- Yes, we have ongoing training
- We have a dedicated security team

**Why This Matters**:
- Baseline knowledge level varies dramatically
- Previously trained teams need refreshers, not basics
- Untrained teams need foundational concepts first
- Tone and complexity should match experience level

**Customization Impact**:
- Never → Start with fundamentals, define terms, basic concepts
- Ongoing training → Advanced topics, recent threats, edge cases
- Dedicated security team → Integration with existing programs, advanced scenarios

## Question Flow

### Recommended Order

1. **Industry** - Sets the regulatory and threat context
2. **Team Size** - Establishes organizational complexity
3. **Work Arrangement** - Defines physical security context
4. **Tools/Platforms** - Identifies specific attack surfaces
5. **Training Experience** - Sets baseline knowledge level

### Why This Order

Start broad (industry) and narrow down to specifics (tools). This feels natural to users and allows each question to build on previous context.

## Optional Advanced Questions (Future Enhancement)

These could be added in later iterations:

- **Primary concerns**: "What security concerns keep you up at night?"
- **Budget**: "What's your approximate security budget?" (for tool recommendations)
- **Compliance requirements**: "Are you subject to specific compliance frameworks?"
- **Incident history**: "Have you experienced security incidents before?"
- **Third-party vendors**: "Do you work with external vendors who need access to your systems?"

## Mapping Answers to Content

### Simple Mapping

Each answer triggers specific content inclusions:

```
Industry = Healthcare
  → Include HIPAA module
  → Use patient data in examples
  → Reference medical terminology

Tools = Slack + Google Workspace
  → Include Slack phishing examples
  → Show Google Drive malware scenarios
  → Reference Gmail-specific phishing signs

Work Arrangement = Remote
  → Include public WiFi safety module
  → Emphasize VPN usage
  → Cover home network security
```

### Combined Logic

More powerful customization comes from combining answers:

```
IF Industry = Finance AND Tools = Microsoft 365
  → Create wire transfer phishing scenarios in Outlook
  → Reference compliance with financial regulations in Teams

IF Team Size = Small AND Training Experience = Never
  → Use simpler language
  → Focus on essential basics
  → Provide actionable, low-cost recommendations

IF Work Arrangement = Hybrid AND Team Size = Large
  → Discuss consistent security policies across locations
  → Cover transition security (leaving office, arriving home)
```

## Implementation Notes

### Minimum Viable Questionnaire

For Phase 4 MVP, you can start with just 3 questions:
1. Industry
2. Tools (pick one: Slack or Microsoft Teams)
3. Work Arrangement

Even this limited set enables meaningful customization and demonstrates the concept.

### Data Storage

Questionnaire responses should be stored per client/instance:

```json
{
  "client_id": "healthcare-corp-001",
  "timestamp": "2024-01-15T10:30:00Z",
  "responses": {
    "industry": "healthcare",
    "team_size": "51-200",
    "tools": ["slack", "google-workspace", "aws"],
    "work_arrangement": "hybrid",
    "training_experience": "never"
  }
}
```

### Validation

- All questions required (or provide "Other" / "Not sure" options)
- Tools question allows multiple selections
- Store responses before triggering content generation
- Allow editing/updating responses and regenerating content

## User Experience Considerations

### Keep It Short

- 5 questions max for MVP
- Each question takes 5-10 seconds to answer
- Total questionnaire time: under 2 minutes

### Clear Purpose

Opening text: "Tell us about your organization so we can create customized security training for your team. This takes less than 2 minutes."

### Visual Progress

- Show progress indicator (Question 1 of 5)
- Allow back/forward navigation
- Save partial responses

### Immediate Value

After submission: "Great! We're generating your customized training content now. This usually takes 30-60 seconds."

Show a progress indicator and maybe preview what's being created.

## Testing Strategy

Create test scenarios for different company profiles:

1. **Small Healthcare Remote Team**: Tests industry compliance + remote security
2. **Large Finance In-Office**: Tests enterprise scale + physical security
3. **Mid-Size Tech Hybrid with Slack**: Tests modern work + specific tooling

Each should produce noticeably different training content.
