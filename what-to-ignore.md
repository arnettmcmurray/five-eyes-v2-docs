# What to Ignore

## Things You Should NOT Spend Time On Right Now

These items were identified in codebase audits or are scope creep. Ignore them until the core chatbot works.

---

## From the Scaffolded Repo (ai-training-module / five-eyes-training-v2)

### Payment Routes
- `src/routes/payment.routes.ts`
- `src/services/stripe.service.ts`
- Any Stripe integration

**Why ignore:** You can't charge for something that doesn't exist. Payments are Phase 5+ territory.

### Complex Auth System
- Custom JWT implementations
- Role-based access control beyond what dashboard has
- Session management beyond basics

**Why ignore:** The dashboard already has working auth (magic links). Use that. Don't reinvent it.

### Phishing Simulation Features
- Email sending systems
- Campaign management
- Batch scheduling

**Why ignore:** Stretch goal beyond the chatbot. Not part of MVP.

### Database Schema from Scaffolded Repo
- Any migrations from the scaffolded repo
- User tables that duplicate dashboard
- Complex relational structures

**Why ignore:** Use the dashboard's existing database. Don't create parallel schemas.

---

## From the Dashboard Repo

### Kubernetes Configs
- `k8s/` folder
- Any `.yaml` deployment files
- Helm charts

**Why ignore:** You're running locally with Docker. K8s is for production deployment you're not doing.

### AWS S3 Integration
- File upload services
- S3 bucket configurations
- Asset storage

**Why ignore:** Not needed for chatbot. Ignore unless explicitly required.

### Redis (for now)
- Redis configuration
- Caching layers

**Why ignore:** You might use Redis for session storage later, but it's not needed to get the chatbot working. Dashboard handles sessions already.

### Production Environment Files
- `compose/.env.prod`
- Any production credentials
- CI/CD pipelines

**Why ignore:** You're developing locally. Don't touch production configs.

---

## Security Issues from Audit

The audit found security issues. **Ignore them for now:**

- Authorization bypass vulnerabilities
- Credentials in version control
- Container security (running as root)
- CSRF protection gaps
- Rate limiting

**Why ignore:** These are real issues for production. But you're building a demo, running locally. Fix security after the chatbot works.

**Exception:** Don't commit YOUR API keys to git. Use `.env` files.

---

## General Categories to Ignore

### Multi-tenant Architecture
- Separate databases per client
- Tenant isolation
- Client switching logic

**Why ignore:** Build for one instance first. Multi-tenant is post-residency.

### Subscription/Billing
- Recurring payments
- Usage tracking
- Tier management

**Why ignore:** Way beyond MVP. Ignore completely.

### Email Systems
- Transactional emails
- Notification systems
- Email templates

**Why ignore:** Not needed for chatbot demo.

### Analytics/Tracking
- Usage analytics
- Event tracking
- Dashboards for admins

**Why ignore:** Nice to have, not need to have.

### Mobile Responsiveness
- Mobile-specific layouts
- Touch interactions
- PWA features

**Why ignore:** Demo will be on a laptop. Mobile is polish.

---

## The Rule

If it's not in the priority stack for Phases 1-4, ignore it.

When in doubt, ask: "Does this help the chatbot work?" If no, ignore it.
