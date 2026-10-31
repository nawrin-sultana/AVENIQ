# Architecture and delivery plan

## Architecture
Client (Next.js client dashboard) → Next.js route handlers (`/api/data`, `/api/ask`, `/api/import`) → seeded synthetic CRM domain model (`lib/engine.ts`). Pure functions calculate health, opportunities, exposure and scenarios. The frontend uses Recharts. User recommendation decisions are browser-local demo state. Optional Prisma/PostgreSQL schema is provided for future persistence.

## Data schema and relationships
Account has many Contact, Opportunity, Activity, SupportCase, Subscription, Renewal. Campaign is a standalone aggregate table in the MVP. Recommendation stores a later server-persistent decision. `prisma/schema.prisma` specifies the model and basic indexes.

## Navigation
Overview | Accounts | Revenue Risks | Growth Opportunities | Revenue War Room | Marketing Intelligence | Scenario Simulator | Ask AVENIQ | Settings.

## Phases and status
1. **Done — Demo foundation:** reproducible synthetic data; linked records, routes, navigation, dashboards, account detail and charts.
2. **Done — Deterministic intelligence:** transparent health scoring, risks, growth and next actions.
3. **Partial — AI capabilities:** deterministic multi-perspective War Room and structured Q&A, no multi-agent LLM integration. Intentionally no fabricated citations.
4. **Partial — Commercial intelligence:** marketing campaign analytics, scenario modeling and CSV validation. Missing production-ready attribution, persistent import and historical snapshots.
5. **Not completed:** end-to-end browser testing, authorization, full production data backend and deployed URL. Full integration testing requires dependency installation and a deploy environment.

## Security boundaries
Public demo uses only synthetic generated data. API route `/api/ask` never forwards the dataset to a third-party model. `/api/import` validates in server memory, refuses payloads over 2 MB, and stores nothing. Before connecting a real CRM, add auth, tenant filtering, anti-CSRF/rate limiting, auditable user approval and encrypted secrets management.
